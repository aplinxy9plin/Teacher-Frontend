import React from 'react';
import { Panel, Group, Avatar, PanelHeader, List, Cell, ScreenSpinner, HeaderButton, IOS, platform, Button, Textarea, InfoRow, Progress, Alert } from '@vkontakte/vkui';

import Recaptcha from 'react-recaptcha'

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back'
import Icon24Back from '@vkontakte/icons/dist/24/back'
const osname = platform();

class CurrentTeacher extends React.Component{
	constructor(props){
		super(props)
		this.state = {
            teacher: null,
            rating: null,
            comments: [],
            text: "",
            captcha: true
        }
        this.onChange = this.onChange.bind(this)
        this.captcha = this.captcha.bind(this)
        this.comment = this.comment.bind(this)
    }
	componentDidMount(){
        this.props.popout(<ScreenSpinner />)
        fetch('http://localhost:1337/get_teacher?id='+this.props.teach_id)
        .then(response => response.json())
        .then(data => {
            var plus = 0, count = 0, mark = data.mark, comments = [];
            for(var i = 0; i < mark.length; i++){
                comments.push({
                    mark: mark[i] === 'like' ? <span role="img" aria-label="like">👍</span> : <span role="img" aria-label="dislike">👎</span>,
                    text: data.text[i]
                })
                if(mark[i] === 'like'){
                    ++plus;
                }
                count++
                if(i === mark.length-1){
                    this.setState({teacher: data, rating: (100 * plus) / count, comments: comments})
                    this.props.popout(null)
                }
            }
        })
    }
    onChange(e){
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value })
    }
    captcha(){
        this.setState({captcha: false})
    }
    comment(e){
        const type = e.currentTarget.name
        this.props.popout(<ScreenSpinner />)
        fetch('http://localhost:1337/add_comment', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mark: type,
                text: this.state.text
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.type === 'ok'){
                fetch('http://localhost:1337/get_teacher?id='+this.props.teach_id)
                .then(response => response.json())
                .then(data => {
                    var plus = 0, count = 0, mark = data.mark, comments = [];
                    for(var i = 0; i < mark.length; i++){
                        comments.push({
                            mark: mark[i] === 'like' ? <span role="img" aria-label="like">👍</span> : <span role="img" aria-label="dislike">👎</span>,
                            text: data.text[i]
                        })
                        if(mark[i] === 'like'){
                            ++plus;
                        }
                        count++
                        if(i === mark.length-1){
                            this.setState({teacher: data, rating: (100 * plus) / count, comments: comments})
                            this.props.popout(null)
                        }
                    }
                })
            }else{
                this.props.popout(
                    <Alert
                        actionsLayout="vertical"
                        actions={[{
                        title: 'Ок',
                        autoclose: true,
                        style: 'cancel'
                        }]}
                        onClose={() => {this.props.popout(null)}}
                    >
                        <h2>Неожиданная ошибка!</h2>
                    </Alert>
                )
            }
        })
    }
	render(){
        var teacher = this.state.teacher
		return(
			<Panel id={this.props.id}>
				<PanelHeader left={<HeaderButton onClick={this.props.go} data-to="home">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</HeaderButton>}>Преподаватель</PanelHeader>
                {
                    this.state.teacher?
                  <Group>
                    <List>
                        <Cell
                            before={teacher.photo ? <Avatar size={72} src={'http://localhost:1337/file/'+teacher.photo} /> : <Avatar size={72} />}
                            size="l"
                            bottomContent={
                                <div>
                                    {"ВУЗ: "+teacher.university}
                                    <br/>
                                    {"Предмет: "+teacher.subject}
                                </div>
                            }
                        >
                        {teacher.first_name+" "+teacher.last_name}
                        </Cell>
                        <Cell>
                            <InfoRow title={"Рейтинг: "+this.state.rating}>
                                <Progress value={this.state.rating} />
                            </InfoRow>
                        </Cell>
                        <Cell>
                            Оставь свой комментарий
                        </Cell>
                        <Cell>
                            <div style={{display: 'flex'}}>
                                <Button onClick={this.comment} name="like" disabled={this.state.captcha} stretched style={{background: "green", height: "40px"}}><span style={{fontSize: "1.6em"}} role="img" aria-label="like">👍</span></Button>
                                <Button onClick={this.comment} name="dislike" disabled={this.state.captcha} stretched style={{background: "tomato", height: "40px"}}><span style={{fontSize: "1.6em"}} role="img" aria-label="dislike">👎</span></Button>
                            </div>
                        </Cell>
                        <Cell>
                            <Textarea placeholder="Текст комментария" onChange={this.onChange} name="text" />
                        </Cell>
                        <Cell>
                            <center>
                                <Recaptcha
                                    sitekey="6LdM1pwUAAAAAEUoDQC0usrszgPujExq4N3F_Gdn"
                                    render="explicit"
                                    verifyCallback={this.captcha}
                                    // onloadCallback={callback}
                                />
                            </center>
                        </Cell>
                    </List>
                    <Group title="Комментарии">
                        <List>
                        {
                            this.state.comments && this.state.comments.map((comment, i) => 
                                    <Cell
                                        key={i}
                                        multiline
                                        before={comment.mark}
                                    >{comment.text}</Cell>
                            )
                        }
                        </List>
                    </Group>
                  </Group>
                  : null
                }
			</Panel>
		)
	}
}

export default CurrentTeacher;