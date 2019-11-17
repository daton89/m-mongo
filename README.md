# m-mongo

[![CircleCI](https://circleci.com/gh/daton89/m-mongo.svg?style=svg)](https://circleci.com/gh/daton89/m-mongo)

MongoDB migration command line tools for dump restore export and import databases

## Requirements

You should have `rsync` installed on you machine

```sh
# on windows with chocolatey
choco install rsync
```

Also the binary of `mongodump` and `mongorestore` must be present in your path.

Then if you need to access MongoDb into a Remote Machine, make sure you have set up an SSH key on the server.

## Introduction

Bored to dump, restore or copy collections between different environments?

`m-mongo` is here to help with these frequent operations.

Let's start by installing it:

```sh
npm i -g @tonillo/m-mongo
# or with yarn
yarn global install @tonillo/m-mongo
```

Now open a terminal or prompt and type `m-mongo`.

![start m-mongo](https://i.imgur.com/V0bTIY6.gif)

We can set up an optional folder where dumps are stored, otherwise by default the dump files will be stored in the current folder.

![set default storage path](https://i.imgur.com/rSh8pML.gif)

We can now add a cluster.

![add a cluster](https://i.imgur.com/cdKi7gA.gif)

All the information that you are inserting, are stored in a json file under `~/.config/configstore/m-mongo.json`.

Now we can make a dump.

![make a dump](https://i.imgur.com/fYMwoiG.gif)

Finally we can restore the dump.

![restore a dump](https://i.imgur.com/EYIwLca.gif)

## Debug

```sh
export DEBUG='*'
```

## Other Informations

This project is created with [typescript-starter](https://github.com/bitjson/typescript-starter).

I was inspired by this [Sitepoint project](https://github.com/sitepoint-editors/ginit), with this usefult [Sitepoint article](https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/)
