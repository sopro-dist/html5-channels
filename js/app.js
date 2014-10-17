var Cambrian = Cambrian || {};
var japi;
if(Cambrian.JAPI !== undefined && !Cambrian.isMockCambrian){
  console.log('Instantiating japi');
  japi = Cambrian.JAPI();
} else {
  // use mocks
  console.log('Instantiating mock japi');
  japi = Cambrian.mockJAPI();
}

//appModule = angular.module("app", ['eee-c.angularBindPolymer'])

appModule = angular.module("app", ['ngMaterial'])
.factory("menu", ['$rootScope', function ($rootScope) {
  var self;
  var groups = ['myGroups', 'myPeerLists'];

  return self = {
    groups: groups,

    selectGroup: function(group) {
      self.currentGroup = group;
      $rootScope.listContains = group;
    },
    isGroupSelected: function (group) {
      return self.currentGroup === group;
    }
  };

}])
.controller("appCtrl", function ($scope, $materialSidenav, $materialDialog, menu, $rootScope) {
  
  $scope.menu = menu;
  $scope.menu.selectGroup(menu.groups[0]);
  $scope.myPeers = japi.me.peers;
  var groups = japi.me.channels;
  console.log(Cambrian);
  $scope.myGroups = Cambrian.me.channels;
  $scope.allChannels = Cambrian.channelsAvailable;
  $scope.myPeerLists = japi.me.peerLists;
  $scope.inputClick = false;

  for (var i=0; i < $scope.allChannels.length; i++) {
    for (var j = 0; j < $scope.myGroups.length; j++) {
       if ($scope.myGroups[j].name == $scope.allChannels[i]) {
          $scope.allChannels.splice(i,1);
       }
     }; 
  };

  /*
  for (var i=0; i < $scope.myPeerLists.length; i++) {
    $scope.myGroups.isActive[i] = false;
  };
  */

  $(document).mouseup(function (e) {
    var container = $("#quickAddBox");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      var exists = ($('#quickAddBox').length === 1)
      if (exists) {
        $scope.$apply(function() {
          $scope.inputClick = false;
          $scope.newGroupType = "";
          $scope.newGroupTitle = "";
          $scope.quickAddForm.$setPristine();
        });       
      }
    }
  });

  $scope.toggleMenu = function () {
    $materialSidenav('left').toggle();
  };

  $scope.listView = "quilt";

  $scope.streamView = function () {
    $scope.listView = "stream";
  };

  $scope.quiltView = function () {
    $scope.listView = "quilt";
  };

  $scope.overflowToggle = function (group) {
    group.overflow = !group.overflow;
  };

  $scope.newGroup = function () {
    //var groupToAdd = { name: $scope.newGroupTitle, groupType: $scope.newGroupType, members: []};
    if ($scope.newGroupType) {
      $scope.newGroupType = $scope.groupTypes[0];
    }
    var groupToAdd = japi.groups.build('channel');
    groupToAdd.name = $scope.newGroupTitle;
    groupToAdd.type = "channel";
    groupToAdd.members = [];
    $scope.myGroups.push(groupToAdd);
    $scope.newGroupTitle = "";
    $scope.quickAddForm.$setPristine();
    $scope.dialog(null, groupToAdd);
  };

  $scope.duplicateGroup = function (group) {
    //var buildGroup = angular.copy(group);
    var buildGroup = japi.groups.build(group);
    console.log(buildGroup);
    buildGroup.name = buildGroup.name + " (Duplicate)";
    buildGroup.overflow = false;
    $scope.myGroups.push(buildGroup);
    group.overflow = false;
  };

  $scope.deleteGroup = function (group) {
    var confirmed = confirm('Are you sure you want to permanently remove the group:\n'+(group.name || ""));
    if(!confirmed){ return }
    var index = $scope.myGroups.indexOf(group);

    if (index > -1) {
      $scope.myGroups.splice(index, 1);  
    }
    group.overflow = false;
    group.destroy();
  };

  $scope.dialog = function (e, group) {
    $materialDialog({
      templateUrl: 'partials/editGroupCard.tmpl.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
        $scope.group = group;
        $scope.japi = japi;
        $scope.newGroupType = group.type;
        console.log('Setting dialog $scope.newGroupType to ',group.type)
        $scope.groupTypes;
        $scope.newGroupTitle = group.name;

        // Filter to display only nonMembers:
        $scope.nonMembers = function(peer){
          for(var i=0; i<$scope.group.members.length; i++){
            if(angular.equals($scope.group.members[i], peer)){ // Peer was found
              return false; // this member should be hidden
            }
          }
          return true; // this nonmember should be shown
        };
        $scope.close = function () {
          $hideDialog();
        };

        $scope.save = function (group) {
          group.save()
          $hideDialog();
        };
      }]
    });
  };

});