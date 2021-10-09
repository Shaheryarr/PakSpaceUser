import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';

const Login = () => {
    
    const handleForgotPassword = () => {
        alert('handleForgotPassword')
    }

    return (
        <>
            <SafeAreaView style={styles.notchContainer} />
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Text>Login</Text>
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