import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import reducers from './reducers';
import {
  makeToggleSettings,
  makeHideHiddenFiles,
  makeEnableAutoUpdateCheck,
  makeEnableAnalytics,
  makeFreshInstall,
  makeFileExplorerListingType,
  makeEnablePrereleaseUpdates
} from './selectors';
import {
  enableAnalytics,
  enableAutoUpdateCheck,
  enablePrereleaseUpdates,
  fileExplorerListingType,
  freshInstall,
  hideHiddenFiles,
  toggleSettings
} from './actions';
import { reloadDirList } from '../HomePage/actions';
import {
  makeCurrentBrowsePath,
  makeMtpStoragesList
} from '../HomePage/selectors';
import SettingsDialog from './components/SettingsDialog';

class Settings extends Component {
  _handleDialogBoxCloseBtnClick = ({ confirm = false }) => {
    const { freshInstall } = this.props;
    this._handleToggleSettings(confirm);

    if (freshInstall !== 0) {
      this._handleFreshInstall();
    }
  };

  _handleToggleSettings = confirm => {
    const { actionCreateToggleSettings } = this.props;
    actionCreateToggleSettings(confirm);
  };

  _handleFreshInstall = () => {
    const { actionCreateFreshInstall } = this.props;

    actionCreateFreshInstall({ isFreshInstall: 0 });
  };

  _handleHiddenFilesChange = ({ ...args }, deviceType) => {
    const {
      actionCreateHideHiddenFiles,
      actionCreateReloadDirList,
      mtpStoragesList,
      currentBrowsePath
    } = this.props;
    const { toggle } = args;

    actionCreateHideHiddenFiles({ ...args }, deviceType);
    actionCreateReloadDirList(
      {
        filePath: currentBrowsePath[deviceType],
        ignoreHiddenFiles: toggle
      },
      deviceType,
      mtpStoragesList
    );
  };

  _handleFileExplorerListingType = ({ ...args }, deviceType) => {
    const { actionCreateFileExplorerListingType } = this.props;

    actionCreateFileExplorerListingType({ ...args }, deviceType);
  };

  _handleAutoUpdateCheckChange = ({ ...args }) => {
    const { actionCreateEnableAutoUpdateCheck } = this.props;

    actionCreateEnableAutoUpdateCheck({ ...args });
  };

  _handlePrereleaseUpdatesChange = ({ ...args }) => {
    const { actionCreateEnablePrereleaseUpdates } = this.props;

    actionCreateEnablePrereleaseUpdates({ ...args });
  };

  _handleAnalyticsChange = ({ ...args }) => {
    const { actionCreateEnableAnalytics } = this.props;

    actionCreateEnableAnalytics({ ...args });
  };

  render() {
    const {
      freshInstall,
      toggleSettings,
      classes: styles,
      ...parentProps
    } = this.props;
    const showSettings = toggleSettings || freshInstall !== 0;

    return (
      <SettingsDialog
        open={showSettings}
        freshInstall={freshInstall}
        toggleSettings={toggleSettings}
        styles={styles}
        onAnalyticsChange={this._handleAnalyticsChange}
        onHiddenFilesChange={this._handleHiddenFilesChange}
        onFileExplorerListingType={this._handleFileExplorerListingType}
        onDialogBoxCloseBtnClick={this._handleDialogBoxCloseBtnClick}
        onAutoUpdateCheckChange={this._handleAutoUpdateCheckChange}
        onPrereleaseUpdatesChange={this._handlePrereleaseUpdatesChange}
        {...parentProps}
      />
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      actionCreateToggleSettings: data => (_, getState) => {
        dispatch(toggleSettings(data));
      },

      actionCreateFreshInstall: data => (_, getState) => {
        dispatch(freshInstall({ ...data }, getState));
      },

      actionCreateHideHiddenFiles: ({ ...data }, deviceType) => (
        _,
        getState
      ) => {
        dispatch(hideHiddenFiles({ ...data }, deviceType, getState));
      },

      actionCreateFileExplorerListingType: ({ ...data }, deviceType) => (
        _,
        getState
      ) => {
        dispatch(fileExplorerListingType({ ...data }, deviceType, getState));
      },

      actionCreateEnableAutoUpdateCheck: ({ ...data }) => (_, getState) => {
        dispatch(enableAutoUpdateCheck({ ...data }, getState));
      },

      actionCreateEnablePrereleaseUpdates: ({ ...data }) => (_, getState) => {
        dispatch(enablePrereleaseUpdates({ ...data }, getState));
      },

      actionCreateEnableAnalytics: ({ ...data }) => (_, getState) => {
        dispatch(enableAnalytics({ ...data }, getState));
      },

      actionCreateReloadDirList: ({ ...args }, deviceType, mtpStoragesList) => (
        _,
        getState
      ) => {
        dispatch(
          reloadDirList({ ...args }, deviceType, mtpStoragesList, getState)
        );
      }
    },
    dispatch
  );

const mapStateToProps = (state, props) => {
  return {
    freshInstall: makeFreshInstall(state),
    toggleSettings: makeToggleSettings(state),
    hideHiddenFiles: makeHideHiddenFiles(state),
    fileExplorerListingType: makeFileExplorerListingType(state),
    enableAutoUpdateCheck: makeEnableAutoUpdateCheck(state),
    enablePrereleaseUpdates: makeEnablePrereleaseUpdates(state),
    enableAnalytics: makeEnableAnalytics(state),
    currentBrowsePath: makeCurrentBrowsePath(state),
    mtpStoragesList: makeMtpStoragesList(state)
  };
};

export default withReducer('Settings', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Settings))
);
