import React, { Component } from 'react';

export interface ICountProps {

}
export interface ICountState {
    count: number;
}
export default class Count extends Component<ICountProps, ICountState> {
    user: App.IUser;
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }

        this.user  = {
            name: 'chong',
            age: 12
        }
    }

    handleClick() {
        this.setState({
            count: this.state.count + 1
        });
    }

    render() {
        return (
            <div>
                Currnt：{this.state.count}<br />
                <button style={{ border: '2px dashed blue' }} onClick={() => this.handleClick()}>Add 1</button>
            </div>
        )
    }
}
