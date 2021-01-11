# Screeps
I made this repo because it seems that the game just wiped all of my code at one point. To get back to a decent starting point I used the tutorial code to get basic functionality back, and have been modifying it since.
# To do
* Harvesters should move resources from containers to storage before falling back to upgrading
* Harvesters
  * Generally re-do how harvesters select their source
  * need to move energy from containers to storage in the case where
    * there exist sources with energy
    * they cannot reach the source
    * all spawns and extensions are full
* Make reusable resource gathering methods
* Fix repair mode (using closest each tick switches between multiple creeps and nothing gets done)
* create differentiated body types for different roles
* automate spawning creeps of variable size
* develop defences
* create 'miner' that gets resources and puts them in a container continuously. Other creeps can take from the container perhaps to more centralized storage.
