import React from 'react';
import { Panel, Button, PanelHeader, File, FormLayout, Input, Textarea } from '@vkontakte/vkui';
import Recaptcha from 'react-recaptcha'
import Icon24Camera from '@vkontakte/icons/dist/24/camera'

class Add extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			captcha: true
        }
        this.onChange = this.onChange.bind(this)
        this.captcha = this.captcha.bind(this)
    }
    onChange(e){
        const { name, value } = e.currentTarget
        this.setState({[name]:value})
    }
    captcha(){
        this.setState({captcha: false})
    }
	render(){
		return(
			<Panel id={this.props.id}>
				<PanelHeader>Добавить преподавателя</PanelHeader>
                <FormLayout>
                    <Input name="first_name" placeholder="Имя" onChange={this.onChange} />
                    <Input name="last_name" placeholder="Фамилия" onChange={this.onChange} />
                    <Input name="university" placeholder="Университет" onChange={this.onChange} />
                    <Input name="subject" placeholder="Предмет" onChange={this.onChange} />
                    <File top="Загрузите фото (необязательно)" before={<Icon24Camera />} size="xl">
                        Открыть галерею
                    </File>
                    <Textarea top="Комментарий" />
                    <center>
                        <Recaptcha
                            sitekey="6LdM1pwUAAAAAEUoDQC0usrszgPujExq4N3F_Gdn"
                            render="explicit"
                            verifyCallback={this.captcha}
                        />
                    </center>
                    <div style={{display: 'flex'}}>
                        <Button onClick={this.add} name="like" disabled={this.state.captcha} stretched style={{background: "green", height: "40px"}}><span style={{fontSize: "1.6em"}} role="img" aria-label="like">👍</span></Button>
                        <Button onClick={this.add} name="dislike" disabled={this.state.captcha} stretched style={{background: "tomato", height: "40px"}}><span style={{fontSize: "1.6em"}} role="img" aria-label="dislike">👎</span></Button>
                    </div>
                </FormLayout>
			</Panel>
		)
	}
}

export default Add;
