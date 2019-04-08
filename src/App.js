import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed'
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline'

import Home from './panels/Home';
import Add from './panels/Add';
import CurrentTeacher from './panels/CurrentTeacher'
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			activeStory: 'teachers',
			fetchedUser: null,
			popout: null,
			teach_id: null
		};
		this.onStoryChange = this.onStoryChange.bind(this);
		this.runPopout = this.runPopout.bind(this);
		this.teachId = this.teachId.bind(this);
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};

	onStoryChange (e) {
		this.setState({ activeStory: e.currentTarget.dataset.story, activePanel: 'home' })
	  }
	
	runPopout(e){
		this.setState({popout: e})
	}

	teachId(e){
		this.setState({teach_id: e.currentTarget.id})
	}

	render() {
		return (
			<Epic activeStory={this.state.activeStory} tabbar={
				<Tabbar>
				  <TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'teachers'}
					data-story="teachers"
					text="Преподаватели"
				  ><Icon28Newsfeed /></TabbarItem>
				  <TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'add'}
					data-story="add"
					text="Добавить"
				  ><Icon28AddOutline /></TabbarItem>
				</Tabbar>
			  }>
				<View id="teachers" activePanel={this.state.activePanel} popout={this.state.popout}>
					<Home id="home" fetchedUser={this.state.fetchedUser} go={this.go} popout={this.runPopout} teachId={this.teachId} />
					<CurrentTeacher id="current_teacher" go={this.go} teach_id={this.state.teach_id} popout={this.runPopout}/>
				</View>
				<View id="add" activePanel={this.state.activePanel}>
			  		<Add id="home" />
				</View>
			  </Epic>
		);
	}
}

export default App;
