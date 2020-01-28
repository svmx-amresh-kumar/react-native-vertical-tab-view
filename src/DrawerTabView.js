// /* @flow */
import * as React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import TabBarVertical from './TabBarVertical';
import TabViewVertical from './TabViewVertical';
import {TabConfig} from './Types';
import PropTypes from 'prop-types';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

DrawerTabView.propTypes = {
    tabConfig: PropTypes.arrayOf(PropTypes.instanceOf(TabConfig))
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabbar: {
      backgroundColor: '#EAEAEA',
      width: 180
    },
    tab: {
      width: 180,
      height: 60,
    },
    indicator: {
      backgroundColor: '#006AC6',
    },
    label: {
      color: '#000',
      fontWeight: '400',
    },
  });

  class SceneComponent extends React.PureComponent {
    render() {
      const { component, ...rest } = this.props;
      return React.createElement(component, rest);
    }
  }

export default class DrawerTabView extends React.Component {
    static defaultProps = {
        tabConfig: []
    };

    state = {
        index: 0,
        routes: []
    }

    constructor(props){
        super(props);
        const {tabConfigs} = props;
        if(tabConfigs.length > 0) {
            const sceneMap = {};
            const routes = tabConfigs.map(eachTabConfig => { 
                sceneMap[eachTabConfig.key] = eachTabConfig.component;
                const route = {'key': eachTabConfig.key, 'title': eachTabConfig.title};
                if(eachTabConfig.icon) {
                    route.icon = eachTabConfig.icon;
                }
                return route;
            });
            this.__sceneMap = sceneMap;
            this.state.routes = routes;
        }
        
    };

    _renderScene =  (params) => {
        const {route,jumpTo,position} = params;
        return <SceneComponent
              key={route.key}
              component={this.__sceneMap[route.key]}
              route={route}
              jumpTo={jumpTo}
              position={position}
            />
    };

    _renderIcon = routes => {
        const {renderIcon} = this.props;
        return renderIcon ? renderIcon(routes.route) : null;
    };
    
    _renderTabBar = props => (
        <TabBarVertical
          {...props}
          scrollEnabled
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          tabStyle={styles.tab}
          labelStyle={styles.label}
          renderIcon = {this._renderIcon}
          animationDuration = {this.props.animationDuration}
          drawerClosedWidth = {this.props.drawerClosedWidth}
          // renderBadge = {this.renderBadge}
        />
      );

    _handleIndexChange = index => this.setState({
        index
      });

    render() {
        const {tabConfigs} = this.props;
        return (
            tabConfigs.length > 0 ? <TabViewVertical
            style={[styles.container, this.props.style]}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
            /> : <View><Text>Must have at least one route</Text></View>
          );
    }
}