pic2svg
============

Provide a library rendering GNU PIC content into svg.

[x] provide a library function doing this
[x] provide a commandline tool doing this
[ ] provide a function, which can be added to expect server, 
    rendering the file on server and return the svg
[ ] provide a server-side script to render graphs

Default font is `Helvetica`, see http://infohost.nmt.edu/tcc/soft/plotutils/plotutils_10.html#SEC67
for possible fonts.

Install Dependencies
===================

There is a tool which installs all dependencies on Debian based systems and on OSX using
homebrew (this is not tested yet, I do not have an OSX machine, so feedback welcome)

```bash
  $ pic2svg-install-tools
```

API
===

```js
  pic2svg = require('pic2svg').pic2svg;
  pic2svg('box "Hello World" ; arrow ; circle "?"'); // returns svg

  graphviz2svg.digraph2svg('A -> B ; B -> C ; C -> A', {pic_font: 'Times'}); // --> returns svg


  // install all tools needed
  pic2svg_install = require('pic2svg/install')
  pic2svg_install()
```
