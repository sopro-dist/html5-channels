roboto
======

SoPro's repo to store Google's roboto font (2014 version)

The master branch contains woff files (~1.44 mb); this is the preferred branch to include in applications.

The ttf branch contains ttf files (~2.76 mb)

The woff files were generated from the tiffs with [this binary](http://sourceforge.net/projects/webify/) from [this project](https://github.com/ananthakumaran/webify); you can use it to make svg or eot font formats if you need them.

The tiffs were downloaded from [google's material design spec](http://www.google.com/design/spec/style/typography.html) except for RobotoSlab which was downloaded from [fontsquirrel](http://www.fontsquirrel.com/fonts/roboto-slab)

Usage
=====
Set this repo as a dependency of your project:

    $ cd project-folder
    $ bower install https://github.com/sopro-components/roboto.git --save

then include the CSS in your project to load all woff fonts as family `Roboto`:

    <link rel="stylesheet" href="bower_components/roboto/2014/roboto-woff.css">

If you are using Polymer, their elements call the font family `RobotoDraft`.  
You can load the fonts as family `RobotoDraft` instead by including:

    <link rel="stylesheet" href="bower_components/roboto/2014/robotodraft-woff.css">