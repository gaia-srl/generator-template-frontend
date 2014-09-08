# Regression Testing

There are a number of tools you can use for this.

## Wraith

[https://github.com/BBC-News/wraith](https://github.com/BBC-News/wraith)

This tool allows you to take full-page screenshots of two different environments and compare the differences.

### Installation

You'll need Ruby, Imagemagick and PhantomJS or SlimerJS. If you're on OS X it is easiest to use [Homebrew](http://brew.sh/).

    $ brew update
    $ brew install phantomjs
    $ brew install imagemagick

Note: I had some problems with imagemagick on my laptop - this answer solved it for me: [http://stackoverflow.com/a/7457876](http://stackoverflow.com/a/7457876)

Full instructions here: [http://bbc-news.github.io/wraith/os-install.html](http://bbc-news.github.io/wraith/os-install.html)

Once everything else is installed you can run the following command in the project root:

    $ bundle install

This should install Wraith.

### Taking screenshots

First we need to boot up the servers. By default Wraith will attempt to compare a compiled page with a development page.

Note: There must be a compiled version of the project in order to test. To compile run `$ grunt build`

Boot up the dev and compiled projects by running (in the project root):

    $ grunt serve-all

This will start the following servers:

 - [http://0.0.0.0:9000](http://0.0.0.0:9000) - development server (`app` directory)
 - [http://0.0.0.0:9001](http://0.0.0.0:9001) - API server
 - [http://0.0.0.0:9002](http://0.0.0.0:9002) - compiled server (`dist` directory)

Now the servers are ready you can take some screenshots

    $ cd test/visual/wraith
    $ wraith capture default

'default' refers to the name of the config file to use.

A gallery will be created showing the screenshots and their diffs:

    test/visual/wraith/shots/gallery.html

### Configuring Wraith

The configuration files are stored in `test/visual/wraith/configs`, you can create as many as you need. 

You can define the pages to compare, the resolutions to test and various other settings.

More info here: [Wraith docs](http://bbc-news.github.io/wraith/index.html)