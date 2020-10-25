import React, { FunctionComponent, useContext } from 'react';

import { DeleteOutlined, DownOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Dropdown, notification } from 'antd';

import './HomeView.scss';

import AppContext from 'app/context';
import { updatePlayground } from 'datastore/collections/playground';
import { PlaygroundView } from 'datastore/collections/playground/playground.model';
import { saveTree, deleteTree } from 'datastore/collections/tree';
import { TreeData } from 'datastore/collections/tree/tree.model';
import { updateVisualization } from 'datastore/collections/visualization';
import { VisualizationStatus } from 'datastore/collections/visualization/visualization.model';
import {
  generateTraversalPath,
  VISUALIZATION_ALGORITHMS_DISPLAY,
  VISUALIZATION_SPEED_DISPLAY,
} from 'helpers/visualization';

const NOTIFICATION_PLACEMENT = 'bottomLeft';
const NOTIFICATION_DURATION = 5; // in seconds

const HomeView: FunctionComponent<any> = ({ speedMenu, visualizationMenu }) => {
  const { state, dispatch } = useContext(AppContext);
  const {
    tree: { data },
    visualization: { algorithm, speed },
  } = state;

  const openNotification = (): void => {
    notification.success({
      message: `Successfully Saved!`,
      description: `A copy of the tree has been saved on your browser. The LeetCode array
        version of the tree has also been copied to your clipboard!`,
      duration: NOTIFICATION_DURATION,
      placement: NOTIFICATION_PLACEMENT,
    });
  };

  // Update reducer, add delete action
  const handleClearTree = () => {
    dispatch(deleteTree());
  };

  const handleSaveTree = () => {
    dispatch(saveTree());
    openNotification();
  };

  const handleStartVisualization = () => {
    dispatch(
      updatePlayground({
        playgroundView: PlaygroundView.Visualization,
      })
    );
    dispatch(
      updateVisualization({
        status: VisualizationStatus.Running,
        traversalPath: generateTraversalPath(data as TreeData, algorithm),
        traversalPathIndex: 0,
      })
    );
  };

  return (
    <div className="overlay">
      <div className="overlay-left">
        <Dropdown.Button
          className="overlay-left-item"
          overlay={visualizationMenu}
          type="primary"
          onClick={handleStartVisualization}
        >
          {`Visualize ${VISUALIZATION_ALGORITHMS_DISPLAY[algorithm]}`}
        </Dropdown.Button>
        <Dropdown className="overlay-left-item" overlay={speedMenu}>
          <Button type="primary">
            {`Speed: ${VISUALIZATION_SPEED_DISPLAY[speed]}`} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <div className="overlay-right">
        <Button
          className="overlay-right-item"
          icon={<SaveOutlined />}
          shape="circle"
          size="large"
          type="primary"
          onClick={handleSaveTree}
        />
        <Button
          className="overlay-right-item danger"
          icon={<DeleteOutlined />}
          shape="circle"
          size="large"
          type="primary"
          onClick={handleClearTree}
        />
      </div>
    </div>
  );
};

export default HomeView;
