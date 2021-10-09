import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../common/CustomHeader';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { createIssue, postImageBase64 } from '../../../SyncServices';

const CreatePost = ({ navigation }) => {

    const [text, setText] = useState('');
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.user);
    const workspace = useSelector(state => state.workspace);

    const config = {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.1,
    };

    const handleBackAction = () => {
        navigation.goBack();
    };

    const handleCamera = () => {
        launchCamera(config, res => {
            const { assets } = res;

            if (assets?.length) {
                setImage(assets[0]);
            }
        });
    };

    const handleGallery = () => {
        launchImageLibrary(config, res => {
            const { assets } = res;

            if (assets?.length) {
                setImage(assets[0]);
                console.log(assets[0]);
            }
        });
    };

    const handleRemoveImage = () => {
        setImage(false);
    };

    const handleSave = () => {
        if (image) {
            let params = {
                image_name: image.base64,
            };

            setLoading(true);

            postImageBase64(params).then(res => {
                const { message } = res;

                handleCreatePost(message.image_url);
            });
        } else {
            setLoading(true);

            handleCreatePost();
        }
    };

    const handleCreatePost = (url = '') => {
        let params2 = {
            workspace_id: workspace.workspace_id,
            content: text,
            image_url: url,
        };

        createIssue(params2).then(res => {
            setLoading(false);
            navigation.reset({
                routes: [
                    {
                        name: 'appRoutes',
                    },
                ],
            });
        });
    };

    return (
        <>
            <SafeAreaView style={styles.notchContainer} />
            <SafeAreaView style={styles.mainContainer}>
                <CustomHeader
                    firstIcon={'chevron-left'}
                    onPressFirstIcon={handleBackAction}
                    save={text || image ? true : false}
                    onPressThirdIcon={handleSave}
                    title={'Create a Post'}
                />

                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.postContainer}>
                        <View style={styles.postFirstRow}>
                            <View style={styles.initialContainer}>
                                <Text style={styles.initialText}>
                                    {user.name?.substring(0, 1).toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.postSecondRow}>
                            <TextInput
                                autoFocus
                                placeholder={`Hey ${user.name}! What's new?`}
                                style={styles.textInputContainer}
                                multiline
                                maxLength={200}
                                onChangeText={text => setText(text)}
                            />
                        </View>
                    </View>

                    {!image ? (
                        <View style={styles.uploadImageContainer}>
                            <TouchableOpacity
                                style={styles.uploadImageIconContainer}
                                onPress={handleCamera}>
                                <View style={styles.uploadImageIcon}>
                                    <Icon name={'camera'} size={25} style={styles.icon} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadImageIconContainer}
                                onPress={handleGallery}>
                                <View style={styles.uploadImageIcon}>
                                    <Icon name={'image-album'} size={25} style={styles.icon} />
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.imageText}>Upload Image</Text>
                        </View>
                    ) : (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: image.uri }}
                                style={styles.image}
                                resizeMode="contain"
                            />

                            <TouchableOpacity
                                style={styles.editImageContainer}
                                onPress={handleRemoveImage}>
                                <View style={styles.editImage}>
                                    <Icon name={'close'} size={25} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default CreatePost;
