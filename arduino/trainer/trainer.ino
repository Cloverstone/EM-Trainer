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
int next(int coil){
  if(coil == CoilAA){return CoilBA;}
  if(coil == CoilBA){return CoilAB;}
  if(coil == CoilAB){return CoilBB;}
  if(coil == CoilBB){return CoilAA;}
}

 

int previous(int coil){
  if(coil == CoilAA){return CoilBB;}
  if(coil == CoilBA){return CoilAA;}
  if(coil == CoilAB){return CoilBA;}
  if(coil == CoilBB){return CoilAB;}
}
int position = 0;

void step(int dir = direction){
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
    interval = DEFAULT_INTERVAL;
  }
  action = STOPPED;
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
    if(direction == FORWARD){
      if(halfStep){
        step();
        wait();
      }else{
        pull(next(current));
      }
    }
  
    if(direction == BACKWARD){
      if(halfStep){
        step();
        wait();
      }else{
        pull(previous(current));
      }
    }
  }

  if (stringComplete) {
    if(inputString == "a"){
      stop();
      Serial.println("AA");
      pull(CoilAA);
    }else if(inputString == "b"){
      stop();
      Serial.println("BA");
      pull(CoilBA);
    }else if(inputString == "c"){
      stop();
      Serial.println("AB");
      pull(CoilAB);
    }else if(inputString == "d"){
      stop();
      Serial.println("BB");
      pull(CoilBB);
    }else if(inputString == "n"){
      stop();
      Serial.println("Next");
      pull(next(current));
    }else if(inputString == "p"){
      stop();
      Serial.println("Previous");
      pull(previous(current));
    }else if(inputString.startsWith("x")){
      Serial.println("Step");
      int count = inputString.substring(1,inputString.length()).toInt();
      if(count > 0){
        for(int i = 0; i< count;i++){
          step(1);
          wait();
        }
        stop();
      }else{
        step(1);
      }
    }else if(inputString == "f"){
      Serial.println("Running Forward...");
      direction = FORWARD;
    }else if(inputString == "h"){
      Serial.println("Half Step...");
      halfStep = !halfStep;
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
      Serial.println("Stopped...");
      action = STOPPED;
    }else if(inputString.startsWith("on")){
      Serial.println("New interval: "+inputString.substring(2,3));
      digitalWrite(coils[inputString.substring(2,3).toInt()], HIGH);
    }else if(inputString.startsWith("off")){
      Serial.println("Coil: "+inputString.substring(3,4));
      digitalWrite(coils[inputString.substring(3,4).toInt()], LOW);
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
