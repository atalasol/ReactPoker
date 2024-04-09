import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {RPDeck} from './rpPoker.js';
import {RPEvaluator} from './rpEvaluator.js';

import {DealerHand} from './dealerhand.jsx';
import {PlayerHand} from './playerhand.jsx';

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dealerWinCount: 0, playerWinCount: 0, index: -1, deck: [], imgIDs:[], temp: '', img: 1 };

  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
 
  dealCards(lastDeck){
    //alert(lastDeck);
    let dck = new RPDeck();
    lastDeck = dck.shuffleNewDeck();
    //thisTable.state.deck = dck.shuffledDeck;
  }

  createImage(imgDiv, imgSrc) {

    //todo let imgs = ["1.png","2.png","3.png"];

    var x = document.createElement("IMG");
    x.setAttribute("src", imgSrc);
    //x.setAttribute("height", "200");
    //x.setAttribute("width", "400");
    x.setAttribute("alt", "ReactPoker.com");
    this.state.img++;

    x.setAttribute("id", 'img-' + this.state.img);

    this.state.imgIDs.push('img-' + this.state.img);


    document.getElementById(imgDiv).appendChild(x);
    document.getElementById('img-' + this.state.img).style.borderRadius = "50%";
  }

  onClickDeal() {

    //let ev = new RPEvaluator();
    //ev.getRank();

    //if(this.state.imgIDs.length > 5){
      //this.removeImages();
    //}
   
    //this.createImage('imgDiv', 'rpi/2.png');

    //grab a new deck
    let dck = new RPDeck();
    this.state.deck  = dck.shuffleCurerentDeck();

    //force a re-render of the component;
    this.forceUpdate();
  }

  removeImages(){
    var parent = document.getElementById('imgDiv');
    for(var i=0; i<this.state.imgIDs.length; i++){
      try{
      parent.removeChild(document.getElementById(this.state.imgIDs[i]));
      }catch(e){};
    }    
  }

  onClickNewDeck() {

    //this.removeImages();    

    //grab a new deck
    let dck = new RPDeck();
    this.state.deck  = dck.startingDeck();
    this.state.deck = [];

    this.state.dealerWinCount = 0;
    this.state.playerWinCount = 0;

    //force a re-render of the component;
    this.forceUpdate();
  }
 

  render() {
    
    let dck = new RPDeck();

    if(this.state.deck.length == 0){
      this.state.deck = dck.startingDeck();
    }

    //get the hands from the deck
    var dealerHand = [];
    var playerHand = [];
    var handCount = 5;
    dck.getHands(this.state.deck, handCount, dealerHand, playerHand)

    //get the hand rankings  
    let dealerHandRank = '';
    let playerHandRank = '';
    let winner = 0; //1=dealer, 2=player, 3=tie

    if(dealerHand[0] != "card_back"){
    
       let evaluator = new RPEvaluator();
       let dealerRank = evaluator.getRank(dealerHand);
       let playerRank = evaluator.getRank(playerHand);

       dealerHandRank = dealerRank.rankName; 
       playerHandRank = playerRank.rankName; 

       winner = evaluator.compareHands(dealerRank, playerRank);
    }
   
    var elDealerWinner = '';
    var elPlayerWinner = '';

    if(winner == 1){
      elDealerWinner = "WINNER! ";
      this.state.dealerWinCount++;
    }

    if(winner == 2){
      elPlayerWinner = "WINNER! ";
      this.state.playerWinCount++;
    }

    if(winner == 3){
      elPlayerWinner = "TIE...";
      elDealerWinner = "TIE...";
    }

    if(winner == 0){
      elPlayerWinner = "The score is 0-0...";
      elDealerWinner = "I WILL CRUSH YOU!";
    }

    var elDealer = dealerHand.map(
      function(name){
        //return <li>{card}</li>;
        var imageName = 'deck4/' + name + '.png';
        return <span><img src={imageName} width='50' height='85' /> </span>;
      }
    ) 

    var elPlayer = playerHand.map(
      function(name){
        //return <li>{card}</li>;
        var imageName = 'deck4/' + name + '.png';
        return <span><img src={imageName} width='50' height='85' /> </span>;
      }
    ) 

    var roundImageStyle = {
     borderRadius: '50%'
    }
  
    var cntr = { 
      textAlign: 'center'
    }

    for (var i=0; i < this.state.deck.length; i++) {
         this.state.temp += "<img src='deck4/" + this.state.deck[i] + ".png' width='50' height='85'/>";
    }
   //      &nbsp;
     //   <img style={roundImageStyle} src="rpi/b3.png" onClick={this.onClickNewDeck.bind(this)}></img>
       // &nbsp;
       // <img style={roundImageStyle} src="rpi/b4.png" onClick={this.onClickNewDeck.bind(this)}></img>
   
    return (
      <div id="dtable" className="">

        <div><font color="white">Wins: {this.state.dealerWinCount} - {elDealerWinner}{dealerHandRank}</font></div>
        {elDealer}<span></span>
        <p id="dh-ph-horiz"></p>

            {elPlayer}<span><font color="white">Wins: {this.state.playerWinCount} - {elPlayerWinner}{playerHandRank}</font></span>
        
        <div style={cntr}>
          <span>
          <img alt="Deal" style={roundImageStyle} src="rpi/deal.png" onClick={this.onClickDeal.bind(this)}></img>
          &nbsp;&nbsp;&nbsp;
          <img style={roundImageStyle} src="rpi/new.png" onClick={this.onClickNewDeck.bind(this)}></img>
          </span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Table />, document.getElementById('rptable'));
