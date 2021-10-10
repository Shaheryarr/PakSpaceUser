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
    Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../common/CustomHeader';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { createIssue, postImageBase64 } from '../../../SyncServices';
import TextField from '../../common/TextField';
import { themeStyleSheet } from '../../../constants';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';

const { width } = Dimensions.get('screen')

const CreateIssue = ({ navigation }) => {

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [coordinates, setCoordinates] = useState({})
    const [landmark, setLandmark] = useState('');
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.user);

    const config = {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.1,
    };

    const handleBackAction = () => {
        navigation.goBack();
    };

    const handleCamera = () => {
        if (images.length > 7) {
            alert(`You can't attach more than 7 images`);
        } else {
            launchCamera(config, res => {
                const { assets } = res;

                if (assets?.length) {
                    setImages(prev => [...prev, assets[0]])
                    setImage(assets[0]);
                }
            });
        }
    };

    const handleGallery = () => {
        if (images.length > 7) {
            alert(`You can't attach more than 7 images`);
        } else {
            launchImageLibrary(config, res => {
                const { assets } = res;

                if (assets?.length) {
                    setImages(prev => [...prev, assets[0]])
                    setImage(assets[0]);
                    console.log(assets[0]);
                }
            });
        }
    };

    const handleRemoveImage = () => {
        setImage(false);
    };

    const handleSave = (coords = {}) => {
        if (images.length > 0) {
            const img_arr = images.map(x => {
                return x.base64
            })

            let params = {
                multiple: true,
                image_name: img_arr,
            };
            console.log(params)
            setLoading(true);

            postImageBase64(params).then(res => {
                const { message } = res;

                handleCreatePost(message.image_url, coords);
            });
        } else {
            setLoading(true);

            handleCreatePost([], coords);
        }
    };

    const getCoordinates = () => {
        if (Platform.OS == 'ios') {
            getIOSPermissions();
        } else {
            //android
            // handleSave();
        }
    }

    const getIOSPermissions = () => {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
            console.log(result)
			if (result === 'granted') {
				findCoordinates();
			} else {
                return;
				handleSave();
			}
		});
    }

    const findCoordinates = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log('POSITION', position);
                const coords = {
                    longitude: position.coords.longitude,
                    lattitude: position.coords.latitude,
                }
                handleSave(coords)
            },
            error => {
                console.log('Error Location access', JSON.stringify(error));
                Toast.show({
                    text: I18n.store_location_access_required,
                });
            },
            {
                enableHighAccuracy: false,
                timeout: 20000,
                // maximumAge: 1000,
            },
        );
    }

    const handleCreatePost = (url = [], coordinates = {}) => {

        let params2 = {
            title,
            landmark,
            content: text,
            image_url: url,
            lattitude: coordinates.lattitude,
            longitude: coordinates.longitude,
            status: 'Pending',
            assign_to_id: ''
        };


        console.log(params2);

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

    const removeImgAtIdx = (idx) => {
        console.log(idx)
        console.log(images.length)
        let img_arr = images;
        img_arr.splice(idx, 1);
        setImages([...img_arr]);
    }

    return (
        <>
            <SafeAreaView style={styles.notchContainer} />
            <SafeAreaView style={styles.mainContainer}>
                <CustomHeader
                    firstIcon={'chevron-left'}
                    onPressFirstIcon={handleBackAction}
                    save={text || image ? true : false}
                    onPressThirdIcon={getCoordinates}
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
                            <TextField
                                label={'Title'}
                                autoFocus
                                placeholder={`Write title here`}
                                maxLength={50}
                                onChange={text => setTitle(text)}
                                customWidth={'100%'}
                                placeholderTextColor={themeStyleSheet.lightgray}
                            />
                            <View
                                style={{
                                    width: width,
                                    alignSelf: 'center',
                                    marginRight: 40
                                    // alignItems: "center"
                                }}
                            >
                                <TextField
                                    label={'Landmark'}
                                    placeholder={`E.g. Clifton, Shahr e Faisal, etc.`}
                                    maxLength={50}
                                    onChange={text => setLandmark(text)}
                                    customWidth={'95%'}
                                    placeholderTextColor={themeStyleSheet.lightgray}
                                />
                                <TextField
                                    label={'Description'}
                                    placeholder={`Write description here`}
                                    multiline
                                    placeholderTextColor={themeStyleSheet.lightgray}
                                    maxLength={500}
                                    onChange={text => setText(text)}
                                    customWidth={'95%'}
                                />
                            </View>

                            {/* <TextInput
                                autoFocus
                                placeholder={`Hey ${user.name}! What's new?`}
                                style={styles.textInputContainer}
                                multiline
                                maxLength={200}
                                onChangeText={text => setText(text)}
                            /> */}
                        </View>
                    </View>

                    {images.length == 0 ? (
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
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {images.map((img, index) => {
                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap'
                                            }}
                                        >
                                            <Image
                                                source={{ uri: img.uri }}
                                                style={styles.image}
                                                resizeMode='cover'
                                            />
                                            <TouchableOpacity
                                                style={styles.editImageContainer}
                                                onPress={() => removeImgAtIdx(index)}>
                                                <View style={styles.editImage}>
                                                    <Icon name={'close'} size={20} style={styles.icon} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>
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
                        </View>
                    )
                    }
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default CreateIssue;
