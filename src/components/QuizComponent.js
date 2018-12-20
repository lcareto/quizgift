import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import Question from "../dto/Question";
import QuestionService from "../service/QuestionService";
import {Icon} from "react-native-elements";
import Modal from "react-native-modal";
import Carousel from "react-native-snap-carousel";
import {FROM, FROM_NAME, HTML, SUBJECT, TO} from "../static/email_config";
import RNExitApp from "react-native-exit-app";

export default class QuizComponent extends Component {

    index = 0;
    questions: Question[] = [];
    questionService: QuestionService;
    state = {
        loading: true,
        currentQuestion: Question,
        answer: null,
        clue: null,
        clueModalVisible: false,
        responseDetailsModalVisible: false,
        responseDetailsModalWithCongrats: false,
        submittedBadAnswer: false,
    };

    constructor(props) {
        super(props);
        this.questionService = new QuestionService();
        this.questions = this.questionService.findAll();
        this.resetState();
    }

    resetState() {
        this.state.currentQuestion = this.questions[this.index];
        this.state.clue = this.state.currentQuestion.clues[0];
        this.state.answer = null;
        this.state.clueModalVisible = false;
        this.state.submittedBadAnswer = false;
        this.state.responseDetailsModalVisible = false;
        this.state.responseDetailsModalWithCongrats = false;
    }

    refreshState() {
        this.setState({...this.state});
    }

    render() {
        let question: Question = this.state.currentQuestion;
        return (
            <ScrollView style={styles.container}>
                {/* Question header */}
                <ImageBackground source={require('../static/quizz_bg_pattern.png')}
                                 style={styles.imgBgContainer}
                                 imageStyle={styles.imgBg}>
                    <View style={styles.questionTitleContainer}>
                        <Text style={styles.questionTitle}>{question.title}</Text>
                    </View>
                </ImageBackground>

                <View style={{flex: 0.5, padding: 15, flexDirection: "column"}}>
                    {/* x of Y */}
                    <Text style={{textAlign: "right"}}>{(this.index + 1) + " / " + this.questions.length}</Text>

                    {/* Question detail */}
                    <Text style={styles.questionDetail}>{question.detail}</Text>

                    {/* Answer Input */}
                    <TextInput
                        style={styles.answer}
                        placeholder={"Tap pour répondre..."}
                        value={this.state.answer}
                        onFocus={() => {
                            this.state.submittedBadAnswer = false;
                            this.refreshState();
                        }}
                        onSubmitEditing={(event) => {
                            this.state.answer = event.nativeEvent.text;
                            this.validateAnswer();
                        }}
                        onChangeText={(val) => {
                            this.state.answer = val;
                            this.refreshState();
                        }}
                    />
                    {/* Answer Input Hint*/}
                    {this.state.submittedBadAnswer && <Text style={styles.badAnswer}>Mauvaise réponse</Text>}
                </View>

                {/* Actions */}
                <View styles={{flex: 0.5}}>
                    {this._renderQuizActions(question)}
                </View>

                {/* Clue modal*/}
                {this._renderClueModal(question)}

                {/* Response Detail modal */}
                {question.responseDetails && this._renderResponseDetailsModal(question)}
            </ScrollView>
        );
    }

    _renderQuizActions(question: Question) {
        return (
            <View style={styles.actionsContainer}>
                {/* Pass */}
                <TouchableOpacity
                    disabled={!question.skippable}
                    onPress={() => this.passQuestion()}>
                    <View><Icon reverse type='ionicon' color={"#7293A0"} name='ios-close'/></View>
                </TouchableOpacity>

                {/* Clue */}
                <TouchableOpacity
                    disabled={!question.clues || question.clues.length === 0}
                    onPress={() => this.toggleClueModal()}>
                    <View><Icon reverse type='ionicon' color={"#A0A4B8"} name='ios-color-wand'/></View>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                    disabled={!this.state.answer}
                    onPress={() => this.validateAnswer()}>
                    <View><Icon reverse type='ionicon' color={"#babfce"} name='ios-rocket'/></View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderClueModal(question: Question) {
        return (
            <Modal isVisible={this.state.clueModalVisible}
                   swipeDirection={"down"}
                   onSwipe={() => this.toggleClueModal()}
                   backdropOpacity={0.55}
                   hideModalContentWhileAnimating={true}
                   style={styles.clueModal}>
                <View style={styles.clueModalContent}>
                    <View><Icon type='ionicon'
                                color={"#F07F5F"}
                                containerStyle={{margin: 15}}
                                name={"ios-star"}/>
                    </View>
                    <Carousel data={question.clues}
                              renderItem={this._renderClueContent}
                              windowSize={1}
                              sliderWidth={Dimensions.get('window').width}
                              itemWidth={Dimensions.get('window').width * 0.75}/>
                </View>
            </Modal>
        );
    }

    _renderClueContent({item, index}) {
        return (
            <View key={index} style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: "#f3f3f3",
                borderRadius: 10,
                padding: 5
            }}>
                <Text style={{textAlign: 'center', fontSize: 16}}>{item}</Text>
            </View>
        );
    }

    _renderResponseDetailsModal(question: Question) {
        let hasNextQuestion = this.hasNexQuestion();
        return (
            <Modal isVisible={this.state.responseDetailsModalVisible}
                   onBackButtonPress={() => this.toggleResponseDetailModal()}
                   onModalHide={() => this.nextQuestion()}
                   hideModalContentWhileAnimating={true}
                   style={styles.responseDetailsModal}>
                <View style={styles.responseDetailsModalContent}>
                    {/* Close */}
                    <TouchableOpacity onPress={() =>
                        hasNextQuestion ? this.toggleResponseDetailModal() : RNExitApp.exitApp()
                    }>
                        <Text style={{color: "#fff", textAlign: "left"}}>Fermer</Text>
                    </TouchableOpacity>

                    {/* Content */}
                    <View style={styles.responseDetailsContainer}>
                        <Icon type='ionicon'
                              color={"#babfce"}
                              size={45}
                              containerStyle={{margin: 15}}
                              name={this.state.responseDetailsModalWithCongrats ? "ios-ribbon" : "ios-happy"}/>
                        {
                            this.state.responseDetailsModalWithCongrats &&
                            <Text style={[styles.responseDetails, {margin: 15, color: "#FDA487"}]}>
                                BRAVO !!!
                            </Text>
                        }
                        <Text style={styles.responseDetails}>{question.responseDetails}</Text>
                    </View>

                    {/* Action */}
                    {hasNextQuestion &&
                    <TouchableOpacity onPress={() => this.toggleResponseDetailModal()}>
                        <Text style={{
                            color: "#fff", textAlign: "center", fontSize: 25,
                            marginTop: 15, marginBottom: 20,
                            padding: 20, backgroundColor: "rgba(255,255,255,0.5)"
                        }}>Continuer</Text>
                    </TouchableOpacity>
                    }
                </View>
            </Modal>
        );
    }

    validateAnswer() {
        let question: Question = this.state.currentQuestion;
        if (this.questionService.isValidAnswer(this.state.answer, question)) {
            this.state.submittedBadAnswer = false;

            if (question.responseDetails) {
                // render response detail modal
                this.toggleResponseDetailModal(true);
            } else {
                this.nextQuestion();
            }
            // Completed quiz state
            if (!this.hasNexQuestion()) {
                this.sendEmailGift();
            }
        } else {
            this.state.submittedBadAnswer = true;
            Vibration.vibrate([0, 100, 50, 100]);
            this.refreshState();
        }
    }

    nextQuestion() {
        if (this.hasNexQuestion()) {
            ++this.index;
            this.resetState();
            this.refreshState();
        }
    }

    passQuestion() {
        Alert.alert(
            'Es-tu sûre ?',
            "Tu devrais plutôt re-essayer en utilisant les indices, avant d'abandonner",
            [
                {text: 'Je persiste', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: "J'abandonne", onPress: () => {
                        if (this.state.currentQuestion.responseDetails) {
                            this.toggleResponseDetailModal()
                        } else {
                            this.nextQuestion();
                        }
                    }
                },
            ],
            {cancelable: true}
        );
    }

    hasNexQuestion() {
        return (this.index + 1) < this.questions.length;
    }

    toggleClueModal() {
        this.state.clueModalVisible = !this.state.clueModalVisible;
        this.refreshState();
    }

    toggleResponseDetailModal(withCongratulation = false) {
        this.state.responseDetailsModalVisible = !this.state.responseDetailsModalVisible;
        if (withCongratulation) {
            this.state.responseDetailsModalWithCongrats = true;
        }
        this.refreshState();
    }

    sendEmailGift() {
        let body = {
            FromEmail: FROM,
            FromName: FROM_NAME,
            Subject: SUBJECT,
            "Text-part": "foo",
            "Html-part": HTML,
            Recipients: [{Email: TO}]
        };
        fetch("https://api.mailjet.com/v3/send", {
            method: "POST",
            headers: {
                Authorization: "Basic YWM5ZDFlZDI3MmYzOTk5ZWM1NmZkOWZlZDFmOTczMmI6ZDhjNmQ1YTNlNzQxMjRjYjk0NTFiYTQxMjRiNGIzZTQ=",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((r) => {
                console.log(r)
            })
            .catch((error) => {
                console.log(error);
                Alert.alert(error);
            });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C02847',
    },
    imgBg: {
        resizeMode: "repeat"
    },
    imgBgContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 9 / 16,
    },
    questionTitleContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignContent: "center"
    },
    questionTitle: {
        color: "#fff",
        fontSize: 33,
        fontFamily: "Roboto",
        fontWeight: "700",
        textAlign: "center",
        padding: 10
    },
    questionDetail: {
        color: "#FDA487",
        fontSize: 25,
        fontFamily: "Roboto",
        fontWeight: "700",
        textAlign: "center",
        padding: 20
    },
    answer: {
        color: "#fff",
        backgroundColor: "#DA4264",
        borderRadius: 5,
    },

    actionsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    clueModal: {
        margin: 0,
        justifyContent: "flex-end",
    },
    clueModalContent: {
        flex: 0.33,
        backgroundColor: "#fff",
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    responseDetailsContainer: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"
    },
    responseDetails: {
        color: "#F07F5F",
        fontSize: 30,
        fontWeight: "300",
        textAlign: "center"
    },
    responseDetailsModal: {
        margin: 0
    },
    responseDetailsModalContent: {
        flex: 1,
        backgroundColor: "#C02847",
        padding: 15
    },
    badAnswer: {
        color: "#cacaca",
        fontSize: 18,
        marginTop: 5,
        marginBottom: 5,
    },
});
