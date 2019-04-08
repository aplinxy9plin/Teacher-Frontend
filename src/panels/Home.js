import React from 'react';
import { Panel, Button, Group, Avatar, PanelHeader, List, Cell, ScreenSpinner } from '@vkontakte/vkui';

class Home extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			teachers: []
		}
	}
	componentDidMount(){
		this.props.popout(<ScreenSpinner />)
		fetch('http://localhost:1337/all_teachers')
		.then(response => response.json())
		.then(data => {
			this.setState({
				teachers: data
			})
			this.props.popout(null)
		})	
	}
	render(){
		return(
			<Panel id={this.props.id}>
				<PanelHeader>Все преподаватели</PanelHeader>
				{
					this.state.teachers && this.state.teachers.map((teacher, i) =>
						<Group key={i}>
							<List>
								<Cell
									before={teacher.photo ? <Avatar size={72} src={'http://localhost:1337/file/'+teacher.photo} /> : <Avatar size={72} />}
									size="l"
									description={"ВУЗ: "+teacher.university}
									bottomContent={
									<div style={{ display: 'flex' }}>
										<Button id={teacher._id} size="l" onClick={(e) => {this.props.teachId(e); this.props.go(e)}} data-to="current_teacher">Посмотреть профиль</Button>
									</div>
									}
								>
								{teacher.first_name+" "+teacher.last_name}
								</Cell>
							</List>
						</Group>
					)
				}
			</Panel>
		)
	}
}

export default Home;
