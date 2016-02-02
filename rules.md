Rules
--

Each player starts the game with 8 BASIC-GAIN-1 cards in their DECK
Each player opens a PACK of 5 CARDS and shuffles them together forming a 10 card PURCHASE
Flip the top 3 cards of the PURCHASE to stacks BUY1 BUY2 and BUY3
Each player draws 4 cards
Determine the first player randomly
Each player performs the phases in their turn in order before play proceeds to the next turn

Phases
	start-of-turn
		-n/a
	main
		-may play a card from their hand
			-resolve text
				-program does as it says and is discard
				-currency goes to currency zone
			-check destroyed
		-may buy a card from the buy stacks
			-cost is paid
			-card created and added to players discard if program, put in a node if a server
			-card removed from buy stack shuffled back into PURCHASE
		-may use an ability on their mainframe
			-cost is paid
			-resolve text
		-may advance to the next phase
	declare-attackers
		-active player can declare which bots are attacking which nodes or mainframe
		-attacking bots are tapped and moved into a SHARED:BATTLE zone
		-may advance to the next phase
	declare-defenders
		-blocking player can declare which bots are blocking which attacking bots
		-on assign, attacker and blocker are moved into a SHARED:COMBATS:COMBAT# zone in an ATTACKING & DEFENDING stack
		-may advance to the next phase
	resolve-damage
		-damage is dealt to each bot in each combat zone equal to their power
		-bots deal damage to nodes/mainframe if unblocked
		-check destroyed
	second-main
		SEE main
	end-of-turn
		-flip new cards from the PURCHASE to the BUY stacks
	draw
		-active player draws till they have 4 cards in hand

Bot is destroyed if reduced to 0 power
Node is destroyed if reduced to 0 health
Mainframe cannot be attacked until Nodes are destroyed
A player loses if their mainframe is reduced to 0 health
A player wins if they are the last player in the game

Costs are paid by removing a currency card from a players CURRENCY stack to their DISCARD stack

