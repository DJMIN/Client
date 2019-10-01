import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import sb from 'react-native-style-block';
import rnStorage from '../../../shared/api/rn-storage.api';
import { loginWithToken } from '../../../shared/redux/actions/user';
import { backNav } from '../redux/actions/nav';
import { NavigationScreenProps } from 'react-navigation';
import { TIcon } from '../components/TComponent';
import styled from 'styled-components/native';

const TipContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

const Loading = React.memo(() => (
  <TipContainer>
    <ActivityIndicator size="large" />
  </TipContainer>
));

const LoadError = React.memo((props: { url: string }) => (
  <TipContainer>
    <Text>加载出错啦!</Text>
    <Text>请检查地址: {props.url}</Text>
  </TipContainer>
));

type WebviewScreenProps = NavigationScreenProps<{
  url: string;
  title: string;
}> &
  DispatchProp<any>;
class WebviewScreen extends React.Component<WebviewScreenProps> {
  static navigationOptions = ({ navigation }) => {
    const url = navigation.getParam('url');

    return {
      headerTitle: navigation.getParam('title', '加载中...'),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <TIcon
            icon="&#xe63c;"
            style={{ fontSize: 26 } as any}
            onPress={async () => {
              if (await Linking.canOpenURL(url)) {
                Linking.openURL(url);
              }
            }}
          />
        </View>
      ),
    };
  };

  canGoBack = false;
  webview: WebView;

  constructor(props) {
    super(props);
  }

  get url() {
    return this.props.navigation.getParam('url', '');
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (this.canGoBack && this.webview) {
      // 可以回退
      this.webview.goBack();
      return true;
    } else {
      // 不能回退
      return false;
    }
  };

  handleStateChange(state) {
    let { loading, title, url, canGoForward, canGoBack, target } = state;

    this.props.navigation.setParams({ title });
    this.canGoBack = canGoBack;
  }

  handleMessage(e) {
    console.log('On Message Data:', e.nativeEvent.data);
    let data = e.nativeEvent.data;
    try {
      data = JSON.parse(data);
      if (data.type === 'onOAuthFinished') {
        let { uuid, token } = data;
        if (!uuid || !token) {
          console.error('oauth登录失败, 缺少必要参数', uuid, token);
          return;
        }

        // 注册新的uuid与token并刷新
        rnStorage.set('uuid', uuid);
        rnStorage.set('token', token);

        this.props.dispatch(loginWithToken(uuid, token, 'qq'));
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const url = this.url;

    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => <Loading />}
        renderError={() => <LoadError url={url} />}
        mixedContentMode={'compatibility'}
        onNavigationStateChange={(state) => this.handleStateChange(state)}
        onMessage={(e) => this.handleMessage(e)}
      />
    );
  }
}

export default connect()(WebviewScreen);