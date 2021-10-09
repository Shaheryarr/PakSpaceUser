import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Dimensions, ScrollView } from 'react-native';
import { EMAIL_PATTERN, isInternetConnected, themeStyleSheet } from '../../../constants';
import Button from '../../common/Buttons';
import TextField from '../../common/TextField';
import styles from './styles';
import { useToast } from 'native-base';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/actions';
import { postLoginRequest } from '../../../SyncServices';

const { width, height } = Dimensions.get('screen');

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const Toast = useToast();

    const dispatch = useDispatch();

    const onChange = (text, type) => {
        setErrors({
            ...errors,
            [type]: '',
        });
        if (type == 'email') {
            setEmail(text);
        } else if (type == 'password') {
            setPassword(text);
        }
    };

    const validateInput = (onlyEmail = false) => {
        let isValid = true;
        let obj = {};
        if (email) {
            if (!EMAIL_PATTERN.test(email)) {
                isValid = false;
                obj = {
                    email: 'Email address is not in the correct format',
                };
            }
        } else {
            isValid = false;
            obj = {
                email: 'Email address is required',
            };
        }
        if (onlyEmail == true) {
            if (isValid == true) return isValid;
            else return obj.email;
        }
        if (password) {
            if (password.length < 8) {
                isValid = false;
                obj = {
                    ...obj,
                    password: 'Password must be more than 8 characters',
                };
            }
        } else {
            isValid = false;
            obj = {
                ...obj,
                password: 'Password is required',
            };
        }

        if (isValid == true) return isValid;
        else return obj;
    };

    const handleLogin = () => {
        Keyboard.dismiss();

        if (validateInput() != true) setErrors(validateInput());
        else {
            isInternetConnected().then(() => {
                let params = {
                    email,
                    password,
                };

                console.log(params);
                setLoading(true);

                postLoginRequest(params).then(res => {
                    const { name, image_url, status, isActive, user_type } = res;

                    if (user_type == 'admin') {
                        alert('An admin can not use admin application.')
                    } else {
                        if (isActive == true) {
                            let userDetails = {
                                name,
                                email,
                                image_url,
                            };
        
                            dispatch(setUser(userDetails)).then(() => {
                                setLoading(false);
        
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'appRoutes' }],
                                });
                            });
                        } else {
                            navigation.navigate('OtpVerification', {
                                email,
                            });
                        }  
                    }                  
                }).catch(err => {
                    setLoading(false);
                    
                    Toast.show({
                        title: err.response.data.message,
                    });
                })
            }).catch(err => {
                Toast.show({
                    title: 'Please connect to the internet',
                });
            });
        }
    }

    const handleForgotPassword = () => {
        alert('handleForgotPassword')
    }

    return (
        <>
            <SafeAreaView style={styles.notchContainer} />
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }} behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
                        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                            <Text style={{ ...styles.heading, color: themeStyleSheet.darkGray }}>Welcome Back</Text>
                            <Text style={{ ...styles.subHeading, color: themeStyleSheet.darkGray }}>Log in to your PakSpace</Text>

                            <ScrollView>
                                <TextField
                                    placeholder="Enter Email Address"
                                    placeholderTextColor={themeStyleSheet.lightgray}
                                    label={'Email Address'}
                                    onChange={text => onChange(text, 'email')}
                                    error={errors.email}
                                    textContentType={'emailAddress'}
                                />
                                <TextField
                                    placeholder="********"
                                    placeholderTextColor={themeStyleSheet.lightgray}
                                    label={'Password'}
                                    secureTextEntry={true}
                                    onChange={text => onChange(text, 'password')}
                                    error={errors.password}
                                    textContentType={'password'}
                                />
                            </ScrollView>
                        </View>

                        <View style={{ height: height * 0.12, justifyContent: 'center' }}>
                            <Button type='secondary' title='Login' loading={loading} onPress={handleLogin} />
                        </View>
                    </KeyboardAvoidingView>
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.subText}>
                            Forgot your password? <Text style={styles.mainText}>Click Here</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Login;