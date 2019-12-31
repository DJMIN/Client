import React from 'react';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import {
  sendFriendInvite,
  agreeFriendInvite,
} from '@shared/redux/actions/user';
import { requestJoinGroup } from '@shared/redux/actions/group';
import { TRPGState, TRPGDispatch } from '@redux/types/__all__';
import _get from 'lodash/get';

import './FindResultItem.scss';

interface Props {
  friendList: string[];
  friendInvite: any;
  friendRequests: any;
  selfUUID: string;
  joinedGroupUUIDs: string[];
  requestingGroupUUID: string[];
  agreeFriendInvite: (uuid: string) => void;
  sendFriendInvite: (uuid: string) => void;
  requestJoinGroup: (uuid: string) => void;

  info: any;
  type: string;
}
class FindResultItem extends React.Component<Props> {
  getUserAction(uuid) {
    let friendList = this.props.friendList;
    let friendInvite = this.props.friendInvite;
    let friendRequests = this.props.friendRequests.map(
      (item) => item.from_uuid
    );
    let selfUUID = this.props.selfUUID;
    if (selfUUID === uuid) {
      return (
        <button disabled>
          <i className="iconfont">&#xe607;</i>我自己
        </button>
      );
    } else if (friendList.indexOf(uuid) >= 0) {
      return (
        <button disabled>
          <i className="iconfont">&#xe604;</i>已添加
        </button>
      );
    } else if (friendInvite.indexOf(uuid) >= 0) {
      return (
        <button disabled>
          <i className="iconfont">&#xe62e;</i>已发送
        </button>
      );
    } else if (friendRequests.indexOf(uuid) >= 0) {
      return (
        <button onClick={() => this.props.agreeFriendInvite(uuid)}>
          <i className="iconfont">&#xe67d;</i>同意
        </button>
      );
    } else {
      return (
        <button onClick={() => this.props.sendFriendInvite(uuid)}>
          <i className="iconfont">&#xe604;</i>添加好友
        </button>
      );
    }
  }

  getGroupAction(uuid) {
    let joinedGroupUUIDs = this.props.joinedGroupUUIDs;
    let requestingGroupUUID = this.props.requestingGroupUUID;
    if (joinedGroupUUIDs.includes(uuid)) {
      return (
        <button disabled>
          <i className="iconfont">&#xe604;</i>已加入
        </button>
      );
    } else if (requestingGroupUUID.includes(uuid)) {
      return (
        <button disabled>
          <i className="iconfont">&#xe604;</i>已申请
        </button>
      );
    } else {
      return (
        <button onClick={() => this.props.requestJoinGroup(uuid)}>
          <i className="iconfont">&#xe604;</i>添加团
        </button>
      );
    }
  }

  render() {
    const info = this.props.info;
    const type = this.props.type || 'user';

    if (type === 'user') {
      const name = info.nickname || info.username;
      return (
        <div className="find-result-item">
          <div className="avatar">
            <img src={info.avatar || config.defaultImg.getUser(name)} />
          </div>
          <div className="profile">
            <span className="username">{name}</span>
            <span className="uuid">{info.uuid}</span>
          </div>
          <div className="action">{this.getUserAction(info.uuid)}</div>
        </div>
      );
    } else if (type === 'group') {
      return (
        <div className="find-result-item">
          <div className="avatar">
            <img src={info.avatar || config.defaultImg.getGroup(info.name)} />
          </div>
          <div className="profile">
            <span className="username">{info.name}</span>
            <span className="uuid">{info.uuid}</span>
          </div>
          <div className="action">{this.getGroupAction(info.uuid)}</div>
        </div>
      );
    }
  }
}

export default connect(
  (state: TRPGState) => ({
    selfUUID: _get(state, ['user', 'info', 'uuid']),
    friendList: _get(state, ['user', 'friendList']),
    friendInvite: _get(state, ['user', 'friendInvite']),
    friendRequests: _get(state, ['user', 'friendRequests']),
    joinedGroupUUIDs: state.group.groups.map((g) => g.uuid),
    requestingGroupUUID: state.group.requestingGroupUUID,
  }),
  (dispatch: TRPGDispatch) => ({
    sendFriendInvite: (uuid: string) => {
      dispatch(sendFriendInvite(uuid));
    },
    agreeFriendInvite: (fromUUID: string) => {
      dispatch((dispatch, getState) => {
        const friendRequests = getState().user.friendRequests;

        let inviteUUID = '';
        for (let req of friendRequests) {
          if (req.from_uuid === fromUUID) {
            inviteUUID = req.uuid;
            break;
          }
        }

        if (!!inviteUUID) {
          dispatch(agreeFriendInvite(inviteUUID));
        }
      });
    },
    requestJoinGroup: (uuid: string) => dispatch(requestJoinGroup(uuid)),
  })
)(FindResultItem);