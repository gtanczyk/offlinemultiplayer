/**
 * @constructor
 */
function stateGameInit() {
    var world = new GameWorld();
    
    var boat = new BoatObject(-400, -200, 0);
    var boat2 = new BoatObject(-400, -150, 0);
    var boat3 = new BoatObject(-350, -200, 0);
    var boat4 = new BoatObject(-350, -150, 0);
    var boat5 = new BoatObject(-300, -200, 0);
    var boat6 = new BoatObject(-300, -150, 0);
    
    var waypoints = [];
    var bonuses = [];
    
    var wx = 0, wy = 0;
    var wdir = Math.PI/6;
    for(var i = 0; i < 16; i++) {
        waypoints.push(new WaypointObject(wx, wy, wdir + Math.PI/2));
        var bdir = wdir + Math.PI * Math.random();
        bonuses.push(new BonusObject(
                wx + Math.sign(Math.random() - Math.random()) * 150 * Math.cos(bdir), 
                wy + Math.sign(Math.random() - Math.random()) * 150 * Math.sin(bdir), 0, 
                Math.random() < 0.5 ? ReverseSteering : ReverseVelocity))
        
        wx += Math.cos(wdir) * 300;
        wy += Math.sin(wdir) * 300;
        wdir += Math.cos(Math.PI / 16 * i) + (Math.random() - Math.random()) / 10;
    }
    
    world.addObject(boat, boat2, boat3, boat4, boat5, boat6);
    world.addObject.apply(world, waypoints);
    world.addObject.apply(world, bonuses);
    
    var race = new Race(world);
    
    race.orderWaypoints.apply(race, waypoints);

    race.addCharacter(new Character(world, race, boat2));
    race.addCharacter(new Character(world, race, boat3));
    race.addCharacter(new Character(world, race, boat4));
    race.addCharacter(new Character(world, race, boat5));
    race.addCharacter(new Character(world, race, boat6));
    
    var HUD = new GameHUD(race, world, boat);

    return function GameInitHandler(eventType, eventObject) {
        renderGame(world, race, boat, HUD);
        HUD.render(GAME_STATE_INIT);
        
        if (eventType == EVENT_TIMEOUT) {
            return new stateGamePlay(world, race, boat, HUD);
        }
    }.WeakState(2000);
};    