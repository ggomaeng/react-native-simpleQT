/**
 * Created by ggoma on 11/4/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

var {height, width} = Dimensions.get('window');

import NavigationBar from 'react-native-navbar';

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
var Carousel = require('react-native-carousel');
import Share, {ShareSheet, Button} from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            verses: [],
            renderOption: false
        }
    }

    componentDidMount() {

        url2 = 'https://58urrdnao7.execute-api.us-west-2.amazonaws.com/api/scrape_everyday';

        fetch(url2, {method: "GET"})
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({ loading: false, e_title: responseData.e_title,
                    e_subtitle: responseData.e_subtitle,
                    e_content: responseData.e_content,
                    e_sharing: responseData.e_sharing});

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

    switchScene() {

        if(!this.state.title) {
            this.setState({loading: true});
            var url = 'https://58urrdnao7.execute-api.us-west-2.amazonaws.com/api/scrape';
            fetch(url, {method: "GET"})
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    this.setState({
                            loading: false,
                            renderOption: !this.state.renderOption,
                            title: responseData.title,
                            subtitle: responseData.subtitle,
                            content: responseData.content,
                            sharing1: responseData.sharing,
                            sharing2: responseData.sharing2,
                            sharing3: responseData.sharing3}
                        ,() => {
                            this.createVerses();
                        });

                })
                .done();

            return
        }

        if(!this.state.e_title) {
            this.setState({loading: true});
            url2 = 'https://58urrdnao7.execute-api.us-west-2.amazonaws.com/api/scrape_everyday';
            fetch(url2, {method: "GET"})
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    this.setState({ loading: false, e_title: responseData.e_title,
                        e_subtitle: responseData.e_subtitle,
                        e_content: responseData.e_content,
                        e_sharing: responseData.e_sharing});

                })
                .done();

            return
        }

        this.setState({renderOption: !this.state.renderOption})
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
            <View style={{alignItems: 'center'}}>
                <Text style={{color: 'black', fontWeight: '700', fontSize: 20}}>{this.state.title}</Text>
            </View>
        )
    }

    renderETitle() {

        return (
            <View style={{alignItems: 'center'}}>
                <Text style={{color: 'black', fontWeight: '700', fontSize: 20}}>{this.state.e_title}</Text>
            </View>
        )
    }

    renderContent() {
        return this.state.verses.map((verse, i) => {
            if(verse.key) {
                return (
                    <View key={i} style={{paddingTop: i==0 ? 0 : 24, paddingBottom: 24}}>
                        <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>{verse.content}</Text>
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


    view1() {
        return (
            <ScrollView style={{flex: 1, padding: 16}}>
                {this.renderContent()}
            </ScrollView>
        )
    }

    view2() {
        return (
            <ScrollView style={{flex: 1, padding: 16}}>
                <View>
                    <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>{this.state.sharing1.title}</Text>
                    <Text/>
                    <Text>{this.state.sharing1.content}</Text>
                </View>
            </ScrollView>
        )
    }

    view3() {
        return (
            <ScrollView style={{flex: 1, padding: 16}}>
                <View>
                    <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>{this.state.sharing2.title}</Text>
                    <Text/>
                    <Text>{this.state.sharing2.content}</Text>
                </View>
            </ScrollView>
        )
    }

    view4() {
        return (
            <ScrollView style={{flex: 1, padding: 16}}>
                <View>
                    <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>{this.state.sharing3.title}</Text>
                    <Text/>
                    <Text>{this.state.sharing3.content}</Text>
                </View>
            </ScrollView>
        )
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



        if(this.state.renderOption) {
            let shareOptions = {
                title: "simpleQT",
                message: "오늘의 큐티말씀",
                url: "http://www.365qt.com/TodaysQT.asp",
                social: 'facebook'//  for email
            };

            var rightButtonConfig = <TouchableOpacity
                style={{width: 24, height:24, borderRadius: 12, margin: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b5998'}}
                onPress={() => Share.shareSingle(shareOptions).
                then(success => console.log(success),
                    error => console.log(error))}

            >
                <Icon name="facebook" color='white' />
            </TouchableOpacity>;

            var leftButtonConfig = <TouchableOpacity
                style={{width: 24, height:24, borderRadius: 12, margin: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b5998'}}
                onPress={() => this.switchScene()}
            >
                <Icon name="repeat" color='white' />
            </TouchableOpacity>;


            var titleConfig = {
                title: this.state.subtitle,
            };
            return (
                <View style={styles.container}>
                    <NavigationBar
                        title={titleConfig}
                        rightButton={rightButtonConfig}
                        leftButton={leftButtonConfig}
                    />
                    {this.renderTitle()}

                    <Carousel
                        indicatorSize={40}
                        indicatorAtBottom={true} width={width} indicatorOffset={0} animate={false} >
                        <View style={styles.screen}>
                            {this.view1()}
                        </View>
                        <View style={styles.screen}>
                            {this.view2()}
                        </View>
                        <View style={styles.screen}>
                            {this.view3()}
                        </View>
                        <View style={styles.screen}>
                            {this.view4()}
                        </View>


                    </Carousel>
                </View>
            )
        } else {
            let shareOptions = {
                title: "simpleQT",
                message: "오늘의 큐티말씀",
                url: "http://www.su.or.kr/03bible/daily/qtView.do?qtType=QT2",
                social: 'facebook'//  for email
            };


            var rightButtonConfig = <TouchableOpacity
                    style={{width: 24, height:24, borderRadius: 12, margin: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b5998'}}
                    onPress={() => Share.shareSingle(shareOptions).
                    then(success => console.log(success),
                        error => console.log(error))}

                >
                    <Icon name="facebook" color='white' />
                </TouchableOpacity>;

            var leftButtonConfig = <TouchableOpacity
                    style={{width: 24, height:24, borderRadius: 12, margin: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b5998'}}
                    onPress={() => this.switchScene()}
                >
                    <Icon name="repeat" color='white' />
                </TouchableOpacity>;

            var titleConfig = {
                title: this.state.e_subtitle,
            };

            return (
                <View style={styles.container}>
                    <NavigationBar
                        title={titleConfig}
                        rightButton={rightButtonConfig}
                        leftButton={leftButtonConfig}
                    />
                    {this.renderETitle()}

                    <Carousel
                        indicatorSize={40}
                        indicatorAtBottom={true} width={width} indicatorOffset={0} animate={false} >
                        <View style={styles.screen}>
                            <ScrollView style={{flex: 1, padding: 16}}>
                                <Text>{this.state.e_content}</Text>
                            </ScrollView>

                        </View>
                        <View style={styles.screen}>
                            <ScrollView style={{flex: 1, padding: 16}}>
                                <Text>{this.state.e_sharing}</Text>
                            </ScrollView>
                        </View>


                    </Carousel>
                </View>
            )
        }


    }


}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: 'white'
    },
    screen: {
        flex: 1,
        width: width,
        paddingBottom: 50
    }
});