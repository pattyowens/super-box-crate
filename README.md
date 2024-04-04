# super-crate-box
* Author: Patrick Owens
* github: pattyowens
* WiscID: paowens

## Summary
This project is going to be a remake of a popular 2D arcade game on Steam called ‘Super Crate 
Box’. I will make a rudimentary copy of this game within the confines of an HTML canvas,
using only the drawing functions we covered in class to create the game. The game is rather 
simple, with a simple menu to start the game and the game itself. The premise is that the playable 
character must collect crates. However, there are enemies that drop into the map and if any non-playable characters (NPC)s touch the playable character (PC), then the game is over. Each crate 
that is collected awards the PC with a different (random) projectile weapon and increments the 
score. There is no victory condition, only survive as long as possible to obtain the highest score. 

This is a game that requires constant user-input, it will rely heavily upon our studies of Canvas 
Buffering, Event Driven Animation, and Hierarchical Modeling. To draw the NPCs and PC, it 
will utilize Oriented Particles, Boids, and Collision Detection. 

## Checklist
* Basic Map + Background
    * Reusable 'objects' (drawing functions) to create map boundaries and floating platforms
    * Hole in the ceiling for new enemies to spawn in
    * Hole in the bottom floor for existing enemies to drop into and 'teleport' to the ceiling spawn-hole
    * Advanced:
        * Make platforms a cirved surface that is at least C(1)
        * Map has style and color, isn't bland
* Title Screen
    * Menu to start the game from (i.e. it doesn't start upon load)
    * Advanced:
        * Keep track of player High-Scores (in the local session, database integration is out of scope for assignment)
* Playable Character
    * Player shold be able to control character using key input
    * Player should be able to fire weapon
* Collectible Crates
    * Crates should increment the score
    * Advanced:
        * Crates should give a random weapon
* Enemies
    * Should move around in a random direction, descending the map platforms until they hit the bottom and cycle again at the top
        * Reuse the same object when falling off the map, don't splice and create a new object
    * Advanced:
        * Enemies have different shapes, sizes, and/or speeds
        * Difficult (speed & quantity) scale with score (# of crates collected) 