//1. Write a program to get a number and number of bits from the user and convert the number into One's complement, two's complement and Excess -M representation. 15 points

import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  AppRegistry,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  View,
} from 'react-native';
import Picker from 'react-native-picker';
import TextField from 'react-native-md-textinput'

const dismissKeyboard = require('dismissKeyboard');

export default class BitsToOnesComplement extends Component {
  constructor(props){
    super(props);
    this.state={
      number:'',
      format:"One's Complement",
      bits:'8 Bits',
    }
  }
  picker = ()=>{

    let data = [];
    data = [
      ["One's Complement", "Two's Complement", "Excess-M"],
      ["4 Bits", "5 Bits", "10 Bits", "8 Bits" ,"16 Bits"]
    ]

    Picker.init({
        pickerTitleText: 'Select representation and bits',
        pickerData: data,
        selectedValue: [this.state.format, this.state.bits],
        onPickerConfirm: data => {
          this.setState({format:data[0], bits:data[1]});
          console.log(data);
        },
        onPickerCancel: data => {
          console.log(data);
        },
        onPickerSelect: data => {
          console.log(data);
        }
    });
    Picker.show();
  }

  render() {
    console.log("This.state: ",this.state);
    return (
      <TouchableWithoutFeedback
      onPress={()=>dismissKeyboard()} style={styles.MainContainer}>
      <View style={styles.MainContainer}>
        <Text style={styles.Welcome}>
          {`Welcome to the Binary to One's and Two's Complement as well as to Excess-M!`}
        </Text>
        <TextField
          label={"Number"}
          onChangeText={(text)=>this.setState({number:text})}
          highlightColor={'#00BCD4'}
          keyboardType={'numeric'}
          value={this.state.number}
          dense={true}
          />
        <View style={styles.FormatAndBits}>
          <TextInput
            style={styles.TextInput}
            onFocus={()=>{
              this.picker();
              dismissKeyboard();
            }}
            value={this.state.format}/>
          <TextInput
            onFocus={()=>{
              this.picker();
              dismissKeyboard();
            }}
            style={[styles.TextInput, {maxWidth:100}]}
            value={this.state.bits}/>
        </View>
        <Text style={styles.Result}>Result: {this.convert()}</Text>
        <View style={styles.Credits}>
          <Text style={styles.CreditsText}>
            Made by Luis Rizo
          </Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }

  convert = () => {
    result = null;
    if (this.state.number.endsWith('-')) {
      return this.state.number;
    }
    if (this.state.number === "") {
      return "";
    }
    if (Math.abs(parseInt(this.state.number))>=(Math.pow(2, parseInt(this.state.bits)-1))) {
      return "Error, Overflow, use more bits";
    }
    if (parseInt(this.state.number)>=0 && this.format!=="Excess-M") {
      return this.addExtraZeros(this.converToBinary(this.state.number), this.state.bits);
    }
    switch (this.state.format) {
      case "One's Complement":
        result = this.OnesComplementConversion();
        break;
      case "Two's Complement":
        result = this.TwosComplementConversion();
        break;
      case "Excess-M":
        result = this.ExcessMConversion();
        break;
      default:
        result = null;
    }
    return result;
  }

  OnesComplementConversion = (param) => {
    var number = param || this.state.number || "0";
    number = this.converToBinary(Math.abs(parseInt(number)).toString());
    number = this.addExtraZeros(number, this.state.bits);
    var result = "";
    for (var i = 0; i < number.length; i++) {
      if (number[i]==="0") {
        number = this.setCharAt(number,i,"1");
      }else if (number[i]==="1") {
        number = this.setCharAt(number,i,"0");
      }
    }
    return number;
  }

  TwosComplementConversion = (param) => {
    var number = this.OnesComplementConversion(this.state.number);
    if (number.endsWith("0")) {
      number = this.setCharAt(number,number.length-1,"1");
    }else if (number.endsWith("1")) {
      for (var i = number.length - 1; i >= 0 ; i--) {
        if (number[i] === "0") {
          number = this.setCharAt(number,i,"1");
          carry = 0
        }else if(number[i] === "1"){
          number = this.setCharAt(number,i,"0");
          carry = 1;
        }
        if (carry === 0) {
          break;
        }
      }
    }
    return number;
  }

  addExtraZeros = (number, bitsParam, fillWith = "0") => {
    var bits = parseInt(bitsParam);
    var result = [];
    var stringResult = "";
    number = number.split("").reverse().join("");
    for (var i = bits-1; i >= 0; i--) {
      result[i] = number[i];
      if (result[i] === undefined) {
        result[i] = fillWith;
      }
    }
    result.reverse();
    for (var i = 0; i < result.length; i++) {
      stringResult = stringResult + result[i];
    }

    return stringResult;
  }

  ExcessMConversion = () => {
    number = parseInt(this.state.number);
    bits = parseInt(this.state.bits);
    var M = (Math.pow(2,bits-1) - 1);
    number = number + M;
    console.log("Number before binary: ", number);
    number = this.converToBinary(number);
    console.log("Number after binary: ", number);
    number = this.addExtraZeros(number.toString(), bits, "0");
    return number;
  }

  setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
  }

  converToBinary = (number = 0) => {
    var radix = 2; //Base to convert to
    var remainder = [];
    var result = [];
    var finalResult = "Error";
    var i = 0;
    if (number || number === 0 && radix) {
      if (isNaN(number) || isNaN(radix)) {
        Alert.alert("Error", "Please enter a valid number and base");
      }else if (number>0){
        do{
          if(i>0){
            result[i] = (parseInt(result[i-1]/radix)); //parsing to Int to get rid of the decimals in the divisions.
            remainder[i] = parseInt(result[i-1] % radix);
          }else{
            result[i] = (parseInt(number/radix, 10));
            remainder[i] = parseInt(number % radix, 10);
          }
          i= i + 1;
        }while(remainder[i-1]>0 || result[i-1]>0);

        //This gets rid of the 0 in the beginning of the array
        //For example (0540 = 540 after this condition);
        if (remainder[remainder.length-1]==0) {
          remainder.pop();
        }

        //Read the results from bottom to top
        remainder.reverse();

        //This will make sure that there is a result, else finalResult = "Error";
        if (remainder.length>0) {
          finalResult = "";
        }

        //Append each element of the remainder to the finalResult
        for(i = 0; i < remainder.length ;i++){
          finalResult = finalResult + remainder[i];
        }
        return finalResult;
      }else {
        return number;
      }
    }else {
      Alert.alert("Error" ,"Please enter a number and a base");
    }
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding:30,
    backgroundColor: '#F5FCFF',
  },
  Welcome:{
    marginHorizontal:30,
    fontSize:18,
    textAlign:'center',
  },
  FormatAndBits:{
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-between'
  },
  TextInput:{
    height:40,
    flex:1,
    marginVertical:20,
  },
  Result:{
    marginTop:30,
    fontSize:16,
  },
  Credits:{
    alignSelf:'center',
    marginTop:80,
  },
  CreditsText:{
    fontSize:15,
  }
});
