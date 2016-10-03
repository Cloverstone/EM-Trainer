#define CoilAA 10
#define CoilAB 11
#define CoilBA 12
#define CoilBB 13
#define Power 9
#define HallEffect A0
#define FORWARD 1
#define BACKWARD -1
#define STOPPED false
#define RUNNING true
#define DEFAULT_INTERVAL 15

#include "pitches.h"
#include "songs.h"

int coils[] = {CoilAA, CoilBA, CoilAB, CoilBB};
String inputString = "";         // a string to hold incoming data
bool stringComplete = false;  // whether the string is complete

int interval = DEFAULT_INTERVAL;
int current = CoilAA;
int action = STOPPED;
int direction = FORWARD;
bool halfStep;
int position = 0;
int mode = 0;

void step(int dir = direction){
  if(!halfStep){
    switch(position){
      case 0: 
        digitalWrite(CoilAA, HIGH);
        digitalWrite(CoilBB, LOW);
        break;
      case 1:
        digitalWrite(CoilBA, HIGH);
        digitalWrite(CoilAA, LOW);
        break;
      case 2:
        digitalWrite(CoilAB, HIGH);
        digitalWrite(CoilBA, LOW);
        break;
      case 3:  
        digitalWrite(CoilBB, HIGH);
        digitalWrite(CoilAB, LOW);
        break;
    }  
    
    position  = position + dir;
    if(position>3){position = 0;}
    if(position<0){position = 3;}
  }else{
     switch(position){
      case 0: 
        digitalWrite(CoilBB, LOW);
        break;
      case 1:
        digitalWrite(CoilBA, HIGH);
        break;
      case 2:
        digitalWrite(CoilAA, LOW);
        break;
      case 3:  
        digitalWrite(CoilAB, HIGH);
        break;
      case 4: 
        digitalWrite(CoilBA, LOW);
        break;
      case 5:  
        digitalWrite(CoilBB, HIGH);
        break;
      case 6: 
        digitalWrite(CoilAB, LOW);
        break;
      case 7:  
        digitalWrite(CoilAA, HIGH);
        break;
    }  
    
    position  = position + dir;
    if(position>7){position = 0;}
    if(position<0){position = 7;}
  }
}

void play(int melody[], int pace, int noteDurations[],int size){
//  int size = sizeof(&melody) / sizeof(int);
//    Serial.println(String(size));
//size =8;
   for (int thisNote = 0; thisNote < size; thisNote++) {
    if(action == RUNNING){
      // to calculate the note duration, take one second
      // divided by the note type.
      //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
      int noteDuration = pace / noteDurations[thisNote];
      tone(CoilAA, melody[thisNote], noteDuration);
  
      // to distinguish the notes, set a minimum time between them.
      // the note's duration + 30% seems to work well:
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);
      // stop the tone playing:
      noTone(CoilAA);
    }else{
      break;  
    }
  } 
}
void reset(){
//  Serial.println("Reset");
  digitalWrite(CoilAA, LOW);
  digitalWrite(CoilAB, LOW);
  digitalWrite(CoilBA, LOW);
  digitalWrite(CoilBB, LOW);
}

void wait(){
  delay(interval);
  if(!halfStep){
    delay(interval);
  }
}

void stop(){
  action = STOPPED;
  reset();
}

void setup() {
  Serial.begin(9600);          //  setup serial
  inputString.reserve(200);
  halfStep = false;
  pinMode(CoilAA, OUTPUT);      // sets the digital pin as output
  pinMode(CoilAB, OUTPUT);      // sets the digital pin as output
  pinMode(CoilBA, OUTPUT);      // sets the digital pin as output
  pinMode(CoilBB, OUTPUT);      // sets the digital pin as output
  pinMode(HallEffect, INPUT);      // sets the digital pin as output

}

void status(){  
  Serial.println("{\"interval\":"+String(interval)
  +",\"direction\":"+String(direction)
  +",\"half_step\":"+String(halfStep)
  +",\"state\":"+String(action)
  +",\"reading\":"+String(analogRead(HallEffect))
  +",\"coils\":[{\"status\":"+String(digitalRead(CoilAA))+"},{\"status\":"+String(digitalRead(CoilBA))+"},{\"status\":"+String(digitalRead(CoilAB))+"},{\"status\":"+String(digitalRead(CoilBB))+"}]}");
}
 

 

void loop() {
  if(action == RUNNING && mode == 0){
        step();
        wait();
  }

  if (stringComplete) {
    if(inputString.startsWith("x")){
      int count = inputString.substring(1,inputString.length()).toInt();
      if(count > 0){
        for(int i = 0; i< count;i++){
          step();
          wait();
        }
        stop();
      }else{
        step();
      }
    }else if(inputString == "f"){
      direction = FORWARD;
    }else if(inputString == "half_step"){
      halfStep = true;  
    }else if(inputString == "status"){
    }else if(inputString == "full_step"){
      halfStep = false;
    }else if(inputString == "r"){
      direction = BACKWARD;
    }else if(inputString == "start"){
      mode = 0;
      action = RUNNING;
    }else if(inputString == "stop"){
      stop(); 
    }else if(inputString.startsWith("power")){
      analogWrite(Power, coils[inputString.substring(5,8).toInt()-1]);
    }else if(inputString.startsWith("on")){
      digitalWrite(coils[inputString.substring(2,3).toInt()-1], HIGH);
    }else if(inputString.startsWith("off")){
      digitalWrite(coils[inputString.substring(3,4).toInt()-1], LOW);
    }else if(inputString.startsWith("i")){
      interval = inputString.substring(1,4).toInt();
    }else if(inputString == "noteoff"){
      noTone(CoilAA);
    }else if(inputString.startsWith("note")){

      int note = inputString.substring(5,9).toInt();
      //int noteDuration = pace1 / 4;
      tone(CoilAA, note);
  
      //int pauseBetweenNotes = noteDuration * 1.30;
      //delay(pauseBetweenNotes);
      
      // stop the tone playing:
      //noTone(CoilAA);

    }else if(inputString.startsWith("play")){
      
      action = RUNNING;
      mode=1;
      int song = inputString.substring(5,6).toInt();
      //quick and dirty figure out how to do this better on arduino
      switch(song){
        case 1:
          play(melody0, pace0, noteDurations0,sizeof(melody0) / sizeof(int));
          break;
        case 2:
          play(melody1, pace1, noteDurations1,sizeof(melody1) / sizeof(int));
          break;
        case 3:
          play(melody2, pace1, noteDurations2,sizeof(melody2) / sizeof(int));
          break;
        case 4:
          play(melody3, pace1, noteDurations3,sizeof(melody3) / sizeof(int));
          break;
//        case 5:
//          play(melody4, pace1, noteDurations4);
//          break;
      }
//      
      action = STOPPED;
    }else{
      stop();
      reset();
    }
    status();
    inputString = "";
    stringComplete = false;
  }

}
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }else{
      // add it to the inputString:
      inputString += inChar;
    }
  }
}
