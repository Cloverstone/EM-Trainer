#define CoilAA 10
#define CoilAB 11
#define CoilBA 12
#define CoilBB 13
#define FORWARD 1
#define BACKWARD -1
#define STOPPED false
#define RUNNING true
#define DEFAULT_INTERVAL 15

int coils[] = {CoilAA, CoilBA, CoilAB, CoilBB};
String inputString = "";         // a string to hold incoming data
bool stringComplete = false;  // whether the string is complete

int interval = DEFAULT_INTERVAL;
int current = CoilAA;
int action = STOPPED;
int direction = FORWARD;
bool halfStep;
int position = 0;

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

void reset(){
  Serial.println("Reset");
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

void pull(int coil){
  current = coil;
  digitalWrite(current, HIGH);
  wait();
  digitalWrite(current, LOW);
};

void stop(){
  if(direction != STOPPED){
    Serial.println("Stopped!");
//    interval = DEFAULT_INTERVAL;
  }
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
}

 

 

void loop() {
  if(action == RUNNING){
        step();
        wait();
  }

  if (stringComplete) {
    if(inputString.startsWith("x")){
      Serial.println("Step");
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
      Serial.println("Running Forward...");
      direction = FORWARD;
    }else if(inputString == "half_step"){
      Serial.println("Half Step...");
      halfStep = true;
    }else if(inputString == "full_step"){
      Serial.println("Full Step...");
      halfStep = false;
    }else if(inputString == "r"){
      Serial.println("Running Backward...");
      direction = BACKWARD;
    }else if(inputString == "start"){
      Serial.println("Running...");
      action = RUNNING;
    }else if(inputString == "stop"){

      stop();
    }else if(inputString.startsWith("on")){
      Serial.println("Coil: "+inputString.substring(2,3));
      digitalWrite(coils[inputString.substring(2,3).toInt()-1], HIGH);
    }else if(inputString.startsWith("off")){
      Serial.println("Coil: "+inputString.substring(3,4));
      digitalWrite(coils[inputString.substring(3,4).toInt()-1], LOW);
    }else if(inputString.startsWith("i")){
      Serial.println("New interval: "+inputString.substring(1,4));
      interval = inputString.substring(1,4).toInt();
    }else if(inputString == "s"){
      if(interval<=10){
        interval = interval - 1;
      }else{
        interval = interval - 5;
      }
      Serial.println("New interval: "+String(interval));
    }else{
      stop();
      reset();
    }
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
