import React from 'react';
import { SafeAreaView, Text, Image, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { themeStyleSheet } from '../../../constants';
import { setUser } from '../../../redux/actions';
import Buttons from '../../common/Buttons';
import styles from './styles';

const Profile = ({ navigation }) => {
    //Functions Here
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setUser({})).then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'GettingStarted' }],
            });
        })
    }

    const handleNewImage = () => {
        
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: themeStyleSheet.white,
                alignItems: 'center'
            }}
        >
            <TouchableOpacity onPress={handleNewImage} style={{ backgroundColor: themeStyleSheet.lightgray, height: 120, width: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <Image source={user.image_url ? { uri: user.image_url } : require('../../../assets/user.png')} style={{ height: '100%', width: '100%' }} resizeMode='contain' />
            </TouchableOpacity>
            <Text
                style={{
                    marginVertical: 10
                }}
            >{user.name}</Text>
            <Text
                style={{
                    marginVertical: 10
                }}
            >{user.email}</Text>
            <Buttons
                onPress={handleLogout}
                type={'primary'}
                title={'logout'}
            />
        </SafeAreaView>
    )
}

export default Profile;