const uuid = require('../util/uuid.js');

module.exports = class Card {
  constructor(data, events) {
    this.events = events;

    for(var prop in data) {
			this[prop] = data[prop];
		}

    //properties
    this.id = uuid();

    //so it knows where it is
    this.previousZone = null;
    this.previousStack = null;

    this.zone = null;
    this.stack = null;

    this.events.emit('card:created', this);
  }

  updateLocation(zone, stack) {
    this.previousZone = this.zone;
    this.zone = zone;

    this.previousStack = this.stack;
    this.stack = stack;
    
    if (this.previousZone !== this.zone) {
      this.events.emit('card:zoneChange', this);
    }

    if (this.previousStack !== this.stack) {
      this.events.emit('card:stackChange', this);
    }
  }
};
