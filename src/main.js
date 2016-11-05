/**
 * Created by ggoma on 11/4/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';

import moment from 'moment';
var Spinner = require('react-native-spinkit');
var types = ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'FadingCircle', 'FadingCircleAlt'];
var greeting = [
    '기쁜 마음으로 성경말씀읽기',
    '오늘 하루 웃으면서 보내기',
    '이웃들을 내 몸처럼 사랑하기',
    '남들 배려하기',
    '새로운 친구 전도해보기',
    '만나는 친구들 칭찬해주기',
    '화내지 말기',
    '겸손한 마음가짐'
];
import FCM from 'react-native-fcm';

export default class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            verses: [],
        }
    }

    componentDidMount() {

        fetch("https://simpleqt-ggoma.c9users.io/api", {method: "GET"})
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({loading: false, title: responseData.title, subtitle: responseData.subtitle, content: responseData.content}
                    ,() => {
                        this.createVerses();
                    });

            })
            .done();

        FCM.requestPermissions();

        var d = new Date();
        d.setHours(12,0,0,0);
        console.log('time set to', d);

        FCM.getFCMToken().then(token => {
            console.log(token)
            // store fcm token in your server

        });

        FCM.getScheduledLocalNotifications().then(notif=>{
            console.log(notif);
            if(notif.length == 0) {
                FCM.scheduleLocalNotification({
                    fire_date: d.getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
                    id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
                    body: "성경말씀 읽어라잉",
                    repeat_interval: "day" //day, hour
                })
            }
        });





    }

    createVerses() {
        var temp = [];
        Object.keys(this.state.content).forEach((key) => {
            temp.push({key: true, content: key});
            this.state.content[key].map(verse => {
                // console.log(verse)
                temp.push({key: false, content: verse});
            })
        });

        this.setState({verses: temp});

    }

    renderTitle() {
        return (
            <View style={{paddingTop: 40, alignItems: 'center'}}>
                <Text>{moment().format('dddd, MMMM Do')}</Text>
                <Text style={{fontWeight: '700', fontSize: 24}}>{this.state.title}</Text>
                <Text style={{fontWeight: '100'}}>{this.state.subtitle}</Text>
            </View>
        )
    }

    renderContent() {
        return this.state.verses.map((verse, i) => {
            if(verse.key) {
                return (
                    <View key={i} style={{paddingTop: i==0 ? 0 : 24, paddingBottom: 24}}>
                        <Text style={{fontWeight: '500', fontSize: 18}}>{verse.content}</Text>
                    </View>
                )
            }

            return (
                <View key={i}>
                    <Text>{verse.content}</Text>
                </View>
            )
        })
    }

    render() {
        if(this.state.loading) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner isVisible={true} style={{margin: 16}} size={48} type={types[Math.floor(Math.random() * types.length)]} color={'black'}/>
                    <Text style={{marginTop: 10}}>{greeting[Math.floor(Math.random() * (greeting.length))]}</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {this.renderTitle()}
                <ScrollView style={{flex: 1, padding: 16}}>
                    {this.renderContent()}
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});