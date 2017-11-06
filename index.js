'use strict';

import React from 'react';
const { Component, PropTypes } = React;

import ReactNative from 'react-native';
const { View, Easing, StyleSheet, Animated, PanResponder } = ReactNative;

import SimpleGesture from 'react-native-simple-gesture';

// Not exported
var rotation = {
    frontRotation: 0,
    backRotation: 0.5
};
var swipeDirection = null;

class SwipeFlip extends Component {
    constructor(props) {
        super(props);

        const frontRotationAnimatedValue = new Animated.Value(rotation.frontRotation);
        const backRotationAnimatedValue = new Animated.Value(rotation.backRotation);

        const interpolationConfig = { inputRange: [0, 1], outputRange: ['0deg', '360deg'] };
        const frontRotation = frontRotationAnimatedValue.interpolate(interpolationConfig);
        const backRotation = backRotationAnimatedValue.interpolate(interpolationConfig);

        this.state = {
            frontRotationAnimatedValue,
            backRotationAnimatedValue,
            frontRotation,
            backRotation,
            isFlipped: props.isFlipped,
            supressSwipe: props.supressSwipe,
            rotateProperty: 'rotateY'
        };
    }

    componentWillMount() {
        if (this.state.supressSwipe == false) {
            this._panResponder = PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
                onPanResponderGrant: (evt, gestureState) => {
                    // do stuff on start -- unused
                },
                onPanResponderMove: (evt, gestureState) => {
                    // do stuff on move -- unused
                },
                onPanResponderTerminationRequest: (evt, gestureState) => true,
                onPanResponderRelease: (evt, gestureState) => { this._onSwipe(evt, gestureState); },
                onPanResponderTerminate: (evt, gestureState) => {
                },
                onShouldBlockNativeResponder: (evt, gestureState) => {
                    return true;
                }
            });
        }
    }

    _onSwipe(evt, gestureState) {
        const sgs = new SimpleGesture(evt, gestureState);

        swipeDirection = sgs.isSwipeLeft() ? 'left' :
                             sgs.isSwipeRight() ? 'right' :
                             sgs.isSwipeUp() ? 'up' :
                             sgs.isSwipeDown() ? 'down' : null;

        if(swipeDirection) {
            this.setState({ rotateProperty: (swipeDirection === 'left' || swipeDirection === 'right') ? 'rotateY' : 'rotateX' });
            this.flip(swipeDirection);
        }
    }

    _getTargetRenderState(swipeDirection) {
        rotation = swipeDirection ? {
            frontRotation: (swipeDirection === 'right' || swipeDirection === 'up') ? rotation.frontRotation + 0.5 : rotation.frontRotation - 0.5,
            backRotation: (swipeDirection === 'right' || swipeDirection === 'up') ? rotation.backRotation + 0.5 : rotation.backRotation - 0.5
        } : rotation;

        return rotation;
    }

    render() {
        return (
            <View {...this.props} { ...this._panResponder.panHandlers }>
                <Animated.View pointerEvents={ this.state.isFlipped ? 'none' : 'auto' }
                               style={[ styles.flippableView, { transform: [{ perspective: this.props.perspective }, { [this.state.rotateProperty]: this.state.frontRotation }] } ]}>
                    { this.props.front }
                </Animated.View>
                <Animated.View pointerEvents={ this.state.isFlipped ? 'auto' : 'none' }
                               style={[ styles.flippableView, { transform: [{ perspective: this.props.perspective }, {[this.state.rotateProperty]: this.state.backRotation}] } ]}>
                    { this.props.back }
                </Animated.View>
            </View>
        );
    }

    flip(swipeDirection) {
        this.props.onFlip();

        if( ['up', 'down', 'left', 'right'].indexOf(swipeDirection) === -1 ) {
            swipeDirection = 'right';
        }

        const nextIsFlipped = !this.state.isFlipped;

        const { frontRotation, backRotation } = this._getTargetRenderState(swipeDirection);

        setImmediate(() => {
            requestAnimationFrame(() => {
                Animated.parallel([
                    this._animateValue(this.state.frontRotationAnimatedValue, frontRotation, this.props.flipEasing),
                    this._animateValue(this.state.backRotationAnimatedValue, backRotation, this.props.flipEasing)
                ]).start(k => {
                    if (!k.finished) { return; }

                    this.setState({ isFlipped: nextIsFlipped });
                    this.props.onFlipped(nextIsFlipped);
                });
            });
        });
    }

    _animateValue(animatedValue, toValue, easing) {
        return Animated.timing(
            animatedValue,
            {
                toValue: toValue,
                duration: this.props.flipDuration,
                easing: easing
            }
        );
    }
}

SwipeFlip.defaultProps = {
    style: {},
    flipDuration: 500,
    supressSwipe: false,
    flipEasing: Easing.out(Easing.ease),
    perspective: 1000,
    onFlip: () => {},
    onFlipped: () => {}
};

SwipeFlip.propTypes = {
    style: View.propTypes.style,
    flipDuration: PropTypes.number,
    flipEasing: PropTypes.func,
    front: PropTypes.object,
    back: PropTypes.object,
    supressSwipe: PropTypes.bool,
    perspective: PropTypes.number,
    onFlip: PropTypes.func,
    onFlipped: PropTypes.func
};

const styles = StyleSheet.create({
    flippableView: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backfaceVisibility: 'hidden'
    }
});

module.exports = SwipeFlip;
