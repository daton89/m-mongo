# m-mongo

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
npm i -g m-mongo
# or with yarn
yarn global install m-mongo
```

Now open a terminal or prompt and type `m-mongo`.

You can set up a default folder where dumps are stored, otherwise the dump files will be stored in the current folder.

Then we need to add at least one cluster.

All the information that you are inserting, are stored in a json file under `~/.config/configstore/m-mongo.json`.

Now we can make a dump.

Finally we can restore the dump.

## Other Informations

This project is created with [typescript-starter](https://github.com/bitjson/typescript-starter).

I was inspired by this [Sitepoint project](https://github.com/sitepoint-editors/ginit), with this usefult [Sitepoint article](https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/)
