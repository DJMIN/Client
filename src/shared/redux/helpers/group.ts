import { getStoreState } from '@redux/configureStore/helper';
import _get from 'lodash/get';

/**
 * @deprecated 应当用hook来代替
 * 获取当前选择的团角色的角色信息
 */
export function getCurrentGroupActor(groupUUID: string) {
  const state = getStoreState()!;

  const userUUID = state.user.info.uuid;
  const groupInfo = state.group.groups.find(
    (group) => group.uuid === groupUUID
  );
  const selfGroupActors = (groupInfo?.group_actors ?? []).filter(
    (i) => i.enabled && i.passed && i.owner?.uuid === userUUID
  );
  const selectedGroupActorUUID = _get(groupInfo, [
    'extra',
    'selected_group_actor_uuid',
  ]);

  const currentGroupActorInfo = selfGroupActors.find(
    (actor) => actor.uuid === selectedGroupActorUUID
  );
  return currentGroupActorInfo;
}
