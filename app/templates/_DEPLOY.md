# Deploying to preview site

The preview site is updated automatically when you push to the `deploy` branch.

However this branch may contain commits from other development branches, so it is **essential** that you OVERWRITE the branch when you want to deploy rather than merging.

    # get the remote branch, if you don't already have it
    $ git fetch
    $ git checkout deploy

    # make sure it is up to date
    $ git pull

    # now switch back to the branch you want to deploy (e.g. master)
    $ git checkout master

    # merge the deploy branch IN using the ours strategy
    $ git merge -s ours deploy

    # now checkout deploy
    $ git checkout deploy

    # and merge the branch you wish to deploy
    $ git merge master

At this point your deploy branch should be identical to the branch you are deploying.

Now you can push the deploy branch up to github

    $ git push

Switch back to your dev branch

    $ git checkout master


