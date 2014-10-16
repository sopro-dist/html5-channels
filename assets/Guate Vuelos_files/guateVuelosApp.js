var gvApp = angular.module("gvApp", ["ngMaterial","ui.date",'ui.mask','ui.select2']); // array is require

gvApp.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

gvApp.controller("gvAppCtrl",['$scope','$materialDialog','$http','xml2json', function ($scope,$materialDialog,$http,xml2json){
  $scope.selectedIndex = 0;
  $scope.user={
    login:false    
  };
  $scope.xml=true;
  $scope.$on('user',function(event,user){
    $scope.user = user;
  });
  /*var params = {address: "guate", sensor: false};
  $http.get(
      'http://maps.googleapis.com/maps/api/geocode/xml',
      {params: params}
    ).then(function(response) {
      var xml = response.data,
      dom = xml2json.parseXml(xml),
      json = xml2json.xml2json(dom);
    });*/
  $scope.signUp = function (e) {
    $materialDialog({
      templateUrl: 'partials/sign-up.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.save = function () {
          if($scope.signUp.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
              name: $scope.nombre,
              lastName: $scope.apellido,
              email: $scope.email,
              documento: $scope.ddv,
              nit: $scope.nit,
              tarjeta: $scope.tdc
            };
            $http.post(
              '/signup',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              if (user.state == 0) {
                $scope.wrongUsername = true;
              } else {
                user.login = true;
                $rootScope.$broadcast('user',user);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  };
  $scope.signIn = function (e) {
    $materialDialog({
      templateUrl: 'partials/sign-in.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.login = function () {
          if($scope.signUp.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
            };
            $http.post(
              '/signin',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              if (user.state == 0) {
                $scope.wrongUsername = true;
              } else {
                user.login = true;
                $rootScope.$broadcast('user',user);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  };
  $scope.logOut = function () {
    $scope.user={
      login:false    
    };
    $scope.selectedIndex = 0;
  }
  $scope.configure = function (e) {
    $materialDialog({
      templateUrl: 'partials/configure.html',
      targetEvent: e,
      locals: {
        user: $scope.user
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','user', function($scope, $hideDialog, $http,$rootScope,user) {
        $scope.username=user.username.trim();
        $scope.password=user.password.trim();
        $scope.nombre=user.name.trim();
        $scope.apellido=user.lastName.trim();
        $scope.email=user.email.trim();
        $scope.ddv=user.documento.trim();
        $scope.nit=user.nit.trim();
        $scope.tdc=user.tarjeta.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.save = function () {
          console.log($scope.config.$valid)
          if($scope.config.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
              name: $scope.nombre,
              lastName: $scope.apellido,
              email: $scope.email,
              documento: $scope.ddv,
              nit: $scope.nit,
              tarjeta: $scope.tdc
            };
            $http.post(
              '/configure',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              user.login = true;
              $rootScope.$broadcast('user',user);
              $hideDialog();
            });
          }
        }
      }]
    });
  };
}]);

gvApp.controller("billetCtrl",['$scope','$http','$materialDialog', function ($scope,$http,$materialDialog){
  $scope.places = [];
  $http.post(
      'getairport'
    ).then(function(response) {
      $scope.places = response.data;
      console.log($scope.places);
    });
  $scope.$on('newAirport',function(event,airline){
    $scope.places.push(airline);
    console.log($scope.places);
  });
  $scope.searchFlight = function(e) { 
    $materialDialog({
      templateUrl: 'partials/search-flights.html',
      targetEvent: e,
      locals: {
        info: {
          fecha:$scope.fecha,
          origen: $scope.origen,
          destino: $scope.destino,
          xml: $scope.xml
        }      
      },
      controller: ['$scope', '$hideDialog','$http','info','$materialDialog', function($scope, $hideDialog, $http, info,$materialDialog) {
        $scope.onSearch = true;
        $scope.origen=info.origen;
        $scope.destino=info.destino;
        $scope.fecha=info.fecha;
        $scope.flightLists = [];/*{
          aerolinea: "Taca",
          vuelo: [{
            numero: "1",
            fecha: "20140930",
            origen: "Totonicapan",
            destino: "Condado",
            hora: "14:00",
            precio: "200.00",
            status: "1"
          },{
            numero: "2",
            fecha: "20140930",
            origen: "Totonicapan",
            destino: "Condado",
            hora: "19:00",
            precio: "100.00",
            status: "2"
          }]
        },{
          aerolinea : "American",
          vuelo: [{
            numero: "2",
            fecha: "20140930",
            origen: "Totonicapan",
            destino: "Condado",
            hora: "11:00",
            precio: "500.00",
            status: "3"
          }]
        }];*/
        Date.prototype.yyyymmdd = function() {
         var yyyy = this.getFullYear().toString();
         var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
         var dd  = this.getDate().toString();
         return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
        };
        var f = info.fecha.yyyymmdd();
        var type = !info.xml? "XML" : "JSON";
        var params = {
          origen: info.origen.trim(), 
          destino: info.destino.trim(),
          fecha: f.trim(),
          type: type.trim()
        };
        $http.post(
          '/searchflight',
          {params: params}
        ).then(function(response) {
          $scope.flightLists = response.data;
          $scope.onSearch = false;
          console.log(response.data);
          
        });
        $scope.reserve = function (vuelo, airline) {
          $hideDialog();
          $materialDialog({
            templateUrl: 'partials/airplane.html',
            targetEvent: e,
            locals: {
              vuelo: vuelo,
              airline: airline
            },
            controller: ['$scope', '$hideDialog','$http','$materialDialog','vuelo','airline', function($scope, $hideDialog, $http,$materialDialog,vuelo,airline) {
              var params = {
                vuelo: vuelo.numero,
                type: airline.type
              };
              $scope.asientos = [];
              $scope.selected = -1;
              $http({headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'X-Random-Shit':'123123123'
                },url:"http://"+airline.host+"/script_lista_asientos."+airline.ext,params: params,method:'GET'}
                ).then(function(res) {
                  console.log("Got response: ");
                  console.log(res.data);
                  var info;
                  if (info.xml) {
                    var xml = res.data.lista_vuelos,
                    dom = xml2json.parseXml(xml),
                    json = xml2json.xml2json(dom);
                    info = json.lista_asientos;
                  } else {
                    info = res.data.lista_asientos;
                  }
                  var l = parseInt(info.filas);
                  for (var i = 0;i < l;i++) {
                    if (info.asiento[i].numero == (i+1)) {
                      asientos[i].value = false;
                      asientos[i].ocupado = false; 
                    } else {
                      asientos[i].value = true;
                      asientos[i].ocupado = true;
                    } 
                  }
                }, function (err) {
                  console.log(err);
                });
              $scope.select = function (i) {
                if ($scope.selected == -1) {
                  $scope.selected = i;
                } else {
                  if (selected != i) { 
                      $scope.asientos[selected].value = false; 
                      $scope.selected = i;
                  } else {
                    if (!$scope.asientos[selected].value) {
                      $scope.selected = -1;
                    }
                  }
                }
              }
              $scope.reserve = function () {
                //
              }
            }]
          });
        }
      }]
    });
  };
  
  /*$scope.disabled = undefined;

  $scope.enable = function() {
    $scope.disabled = false;
  };

  $scope.disable = function() {
    $scope.disabled = true;
  };

  $scope.clear = function() {
    $scope.person.selected = undefined;
    $scope.address.selected = undefined;
    $scope.country.selected = undefined;
  };

  $scope.address = {};
  $scope.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      $scope.addresses = response.data.results
    });
  };*/
}]);
gvApp.controller("superuserCtrl",['$scope','$materialDialog','$http',function ($scope,$materialDialog,$http){
  $http.post(
      'getairline'
    ).then(function(response) {
      $scope.airlines = response.data;
    });
  $scope.$on('newAirline',function(event,airline){
    $scope.airlines.push(airline);
  });
  $scope.$on('newAirlines',function(event,airlines){
    $scope.airlines = airlines;
  });
  $scope.add = function (e) {
    $materialDialog({
      templateUrl: 'partials/addAirline.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.add = function () {
          console.log("add");
          if($scope.addAirline.$valid) {
            console.log("add valid");
            var params = {
              codigo: $scope.codigo, 
              nombre: $scope.nombre,
              host: $scope.host,
              ext: $scope.ext
            };
            $http.post(
              '/addairline',
              {params: params}
            ).then(function(response) {
              var airline = response.data;
              if (airline.state == 0) {
                $scope.wrongCode = true;
              } else {
                $rootScope.$broadcast('newAirline',airline);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  }
  $scope.edit = function (e,airline) {
    $materialDialog({
      templateUrl: 'partials/editAirline.html',
      targetEvent: e,
      locals: {
        airline: airline
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airline', function($scope, $hideDialog, $http,$rootScope,airline) {
        $scope.codigo = airline.codigo.trim();
        $scope.nombre = airline.nombre.trim();
        $scope.host = airline.host.trim();
        $scope.ext = airline.ext.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.edit = function () {
          if($scope.editAirline.$valid) {
            var params = {
              codigo: $scope.codigo, 
              nombre: $scope.nombre,
              host: $scope.host,
              ext: $scope.ext
            };
            $http.post(
              '/editairline',
              {params: params}
            ).then(function(response) {
              console.log(response);
              var airlines = response.data;
              $rootScope.$broadcast('newAirlines',airlines);
              $hideDialog();
            });
          }
        }
      }]
    });
  }
  $scope.delete = function (e,airline) {
    $materialDialog({
      templateUrl: 'partials/deleteAirline.html',
      targetEvent: e,
      locals: {
        airline: airline
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airline', function($scope, $hideDialog, $http,$rootScope,airline) {
        $scope.codigo = airline.codigo;
        $scope.nombre = airline.nombre;
        $scope.host = airline.host;
        $scope.ext = airline.ext;
        $scope.close = function() {
          $hideDialog();
        };
        $scope.delete = function () {
          var params = {
            codigo: $scope.codigo, 
            nombre: $scope.nombre,
            host: $scope.host,
            ext: $scope.ext
          };
          $http.post(
            '/deleteairline',
            {params: params}
          ).then(function(response) {
            var airlines = response.data;
            $rootScope.$broadcast('newAirlines',airlines);
            $hideDialog();
          });
        }
      }]
    });
  }

}]);

gvApp.controller("superuserAirportCtrl",['$scope','$materialDialog','$http',function ($scope,$materialDialog,$http){
  $http.post(
      'getairport'
    ).then(function(response) {
      $scope.airports = response.data;
    });
  $scope.$on('newAirport',function(event,airport){
    $scope.airports.push(airport);
  });
  $scope.$on('newAirports',function(event,airports){
    $scope.airports = airports;
  });
  $scope.add = function (e) {
    $materialDialog({
      templateUrl: 'partials/addAirport.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.add = function () {
          console.log("add")
          if($scope.addAirport.$valid) {
            console.log("add valid")
            var params = {
              id: $scope.id, 
              name: $scope.name,
              place: $scope.place
            };
            $http.post(
              '/addairport',
              {params: params}
            ).then(function(response) {
              var airport = response.data;
              if (airport.state == 0) {
                $scope.wrongCode = true;
              } else {
                $rootScope.$broadcast('newAirport',airport);
                $hideDialog();
              } 
            });
            console.log("post")
          }
        }
      }]
    });
  }
  $scope.edit = function (e,airport) {
    $materialDialog({
      templateUrl: 'partials/editAirport.html',
      targetEvent: e,
      locals: {
        airport: airport
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airport', function($scope, $hideDialog, $http,$rootScope,airport) {
        $scope.id = airport.id.trim();
        $scope.name = airport.name.trim();
        $scope.place = airport.place.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.edit = function () {
          console.log("aqui")
          if($scope.editAirport.$valid) {
            console.log("alla")
            var params = {
              id: $scope.id, 
              name: $scope.name,
              place: $scope.place
            };
            $http.post(
              '/editairport',
              {params: params}
            ).then(function(response) {
              console.log(response);
              var airports = response.data;
              $rootScope.$broadcast('newAirports',airports);
              $hideDialog();
            });
            console.log("asaber")
          }
        }
      }]
    });
  }
  $scope.delete = function (e,airport) {
    $materialDialog({
      templateUrl: 'partials/deleteAirport.html',
      targetEvent: e,
      locals: {
        airport: airport
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airport', function($scope, $hideDialog, $http,$rootScope,airport) {
        $scope.id = airport.id;
        $scope.name = airport.name;
        $scope.place = airport.place;
        $scope.close = function() {
          $hideDialog();
        };
        $scope.delete = function () {
          var params = {
            id: $scope.id, 
            name: $scope.name,
            place: $scope.place
          };
          $http.post(
            '/deleteairport',
            {params: params}
          ).then(function(response) {
            var airports = response.data;
            $rootScope.$broadcast('newAirports',airports);
            $hideDialog();
          });
        }
      }]
    });
  }

}]);

gvApp.factory('xml2json',function(){
  return {
    parseXml:function(xml) {
     var dom = null;
     if (window.DOMParser) {
        try { 
           dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
        } 
        catch (e) { dom = null; }
     }
     else if (window.ActiveXObject) {
        try {
           dom = new ActiveXObject('Microsoft.XMLDOM');
           dom.async = false;
           if (!dom.loadXML(xml)) // parse error ..

              window.alert(dom.parseError.reason + dom.parseError.srcText);
        } 
        catch (e) { dom = null; }
     }
     else
        alert("cannot parse xml string!");
     return dom;
   },
   xml2json:function(xml, tab) {
     var X = {
        toObj: function(xml) {
           var o = {};
           if (xml.nodeType==1) {   // element node ..
              if (xml.attributes.length)   // element with attributes  ..
                 for (var i=0; i<xml.attributes.length; i++)
                    o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
              if (xml.firstChild) { // element has child nodes ..
                 var textChild=0, cdataChild=0, hasElementChild=false;
                 for (var n=xml.firstChild; n; n=n.nextSibling) {
                    if (n.nodeType==1) hasElementChild = true;
                    else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                    else if (n.nodeType==4) cdataChild++; // cdata section node
                 }
                 if (hasElementChild) {
                    if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                       X.removeWhite(xml);
                       for (var n=xml.firstChild; n; n=n.nextSibling) {
                          if (n.nodeType == 3)  // text node
                             o["#text"] = X.escape(n.nodeValue);
                          else if (n.nodeType == 4)  // cdata node
                             o["#cdata"] = X.escape(n.nodeValue);
                          else if (o[n.nodeName]) {  // multiple occurence of element ..
                             if (o[n.nodeName] instanceof Array)
                                o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                             else
                                o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                          }
                          else  // first occurence of element..
                             o[n.nodeName] = X.toObj(n);
                       }
                    }
                    else { // mixed content
                       if (!xml.attributes.length)
                          o = X.escape(X.innerXml(xml));
                       else
                          o["#text"] = X.escape(X.innerXml(xml));
                    }
                 }
                 else if (textChild) { // pure text
                    if (!xml.attributes.length)
                       o = X.escape(X.innerXml(xml));
                    else
                       o["#text"] = X.escape(X.innerXml(xml));
                 }
                 else if (cdataChild) { // cdata
                    if (cdataChild > 1)
                       o = X.escape(X.innerXml(xml));
                    else
                       for (var n=xml.firstChild; n; n=n.nextSibling)
                          o["#cdata"] = X.escape(n.nodeValue);
                 }
              }
              if (!xml.attributes.length && !xml.firstChild) o = null;
           }
           else if (xml.nodeType==9) { // document.node
              o = X.toObj(xml.documentElement);
           }
           else
              alert("unhandled node type: " + xml.nodeType);
           return o;
        },
        toJson: function(o, name, ind) {
           var json = name ? ("\""+name+"\"") : "";
           if (o instanceof Array) {
              for (var i=0,n=o.length; i<n; i++)
                 o[i] = X.toJson(o[i], "", ind+"\t");
              json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
           }
           else if (o == null)
              json += (name&&":") + "null";
           else if (typeof(o) == "object") {
              var arr = [];
              for (var m in o)
                 arr[arr.length] = X.toJson(o[m], m, ind+"\t");
              json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
           }
           else if (typeof(o) == "string")
              json += (name&&":") + "\"" + o.toString() + "\"";
           else
              json += (name&&":") + o.toString();
           return json;
        },
        innerXml: function(node) {
           var s = ""
           if ("innerHTML" in node)
              s = node.innerHTML;
           else {
              var asXml = function(n) {
                 var s = "";
                 if (n.nodeType == 1) {
                    s += "<" + n.nodeName;
                    for (var i=0; i<n.attributes.length;i++)
                       s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                    if (n.firstChild) {
                       s += ">";
                       for (var c=n.firstChild; c; c=c.nextSibling)
                          s += asXml(c);
                       s += "</"+n.nodeName+">";
                    }
                    else
                       s += "/>";
                 }
                 else if (n.nodeType == 3)
                    s += n.nodeValue;
                 else if (n.nodeType == 4)
                    s += "<![CDATA[" + n.nodeValue + "]]>";
                 return s;
              };
              for (var c=node.firstChild; c; c=c.nextSibling)
                 s += asXml(c);
           }
           return s;
        },
        escape: function(txt) {
           return txt.replace(/[\\]/g, "\\\\")
                     .replace(/[\"]/g, '\\"')
                     .replace(/[\n]/g, '\\n')
                     .replace(/[\r]/g, '\\r');
        },
        removeWhite: function(e) {
           e.normalize();
           for (var n = e.firstChild; n; ) {
              if (n.nodeType == 3) {  // text node
                 if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                    var nxt = n.nextSibling;
                    e.removeChild(n);
                    n = nxt;
                 }
                 else
                    n = n.nextSibling;
              }
              else if (n.nodeType == 1) {  // element node
                 X.removeWhite(n);
                 n = n.nextSibling;
              }
              else                      // any other node
                 n = n.nextSibling;
           }
           return e;
        }
     };
     if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
     var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
     return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
  }
  } 
});