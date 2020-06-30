# Move files from glide/update/customer to respective repo folder

Run this from `glide/update/customer` folder

## How to run?

`
node ~/files_to_commit/src/index.js -d 1
`

## Pre-req

Set up an env variable COMMIT_REPOS to indicate which all repos you are interested in. For example in you bash_profile you can add the following

`
export COMMIT_REPOS=app-spend-catalog:app-fin-common:app-fin-close-intg
`

## Options

-d or --days will denote how many days back the folder has to be scanned. -d 1 means only todays file, -d 2 means only today and yesterdays files. If you don't pass days param it will scan entire directory and can be very performant :)

## What files get moved

Files which have been found in a single place in COMMIT_REPOS given will be moved automatically. Files not found are listed. And by chance if a file is found in multiple paths, the file and the corresponding paths are listed.

