# react-native-swipe-flip
A React Native view component that flips front-to-back in response to swipe gestures.

## Installation

```sh
npm install react-native-swipe-flip
```

## Demo
![swipeflipdemo](http://i.imgur.com/FJ9YPip.gifv)

## Interaction
The view will respond to the following swipes:
* Left
* Right
* Up
* Down

## Example

```js
'use strict';

import React from 'react';
import { View, Text, Easing } from 'react-native';

import SwipeFlip from 'react-native-swipe-flip';

export default class Playground extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#A5D6A7' }}>
                <SwipeFlip style={{ flex: 1 }}
                          front={ this._renderFront() }
                          back={ this._renderBack() }
                          onFlipped={(val) => { console.log('Flipped: ' + val); }}
                          flipEasing={ Easing.out(Easing.ease) }
                          flipDuration={ 500 }
                          perspective={ 1000 }/>
            </View>
        )
    }

    _renderFront() {
        return (
            <View style={{ flex: 1, backgroundColor: '#3F51B5', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'black', padding: 20 }}>
                    <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>
                        { `FRONT\nSwipe to flip!` }
                    </Text>
                </View>
            </View>
        );
    }

    _renderBack() {
        return (
            <View style={{ flex: 1, backgroundColor: '#C2185B', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'black', padding: 20 }}>
                    <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>
                        { `BACK\nSwipe to flip!` }
                    </Text>
                </View>
            </View>
        );
    }
}
```

.babelrc:
```js
{
  "retainLines": true,
  "whitelist": [
    "es6.arrowFunctions",
    "es6.blockScoping",
    "es6.classes",
    "es6.constants",
    "es6.destructuring",
    "es6.modules",
    "es6.parameters",
    "es6.properties.computed",
    "es6.properties.shorthand",
    "es6.spread",
    "es6.templateLiterals",
    "es7.asyncFunctions",
    "es7.trailingFunctionCommas",
    "es7.objectRestSpread",
    "es7.classProperties",
    "es7.decorators",
    "flow",
    "react",
    "react.displayName",
    "regenerator"
  ]
}
```

# Thanks
Big thanks to [@kevinstumpf](https://github.com/kevinstumpf) for [React Native Flip View](https://github.com/kevinstumpf/react-native-flip-view) and [@christopherabouabdo](https://github.com/christopherabouabdo) for [React Native Simple Gesture](https://github.com/christopherabouabdo/react-native-simple-gesture).