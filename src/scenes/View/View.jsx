import React, { Component } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import './View.scoped.css';

import Button from '../../components/Buttons/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router';
import Modal from '../../components/Modal/Modal';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  setShowModal = (showModal) => this.setState({ showModal });

  handleEditToggle = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  };

  handleCancelClick = () => {
    const { isEditing } = this.state;
    const { setEditForm, viewedData } = this.props;
    this.setState({ isEditing: !isEditing, showModal: false });

    const filteredKeys = Object.keys(viewedData).filter((key) => {
      if (
        key !== 'createdBy' &&
        key !== 'creationDate' &&
        key !== 'lastModifiedBy' &&
        key !== 'lastModifiedDate'
      ) {
        return key;
      }
    });

    const editForm = {};
    for (let key of filteredKeys) {
      editForm[key] = '';
    }

    setEditForm(editForm);
    this.setState({ isEditing: !isEditing });
  };

  handleReturnToDashboard = () => {
    const { isEditing } = this.state;
    const { history } = this.props;

    if (!isEditing) {
      history.push('/dashboard');
    } else {
      this.setShowModal(true);
    }
  };

  handleSubmitClick = (e) => {
    const { handleEditFormSubmit } = this.props;

    handleEditFormSubmit(e);
    this.handleEditToggle();
  };

  handleDiscardClick = () => {
    const { history } = this.props;

    this.setShowModal(false);
    history.push('/dashboard');
  };

  render() {
    const { isEditing, showModal } = this.state;
    const {
      setEditFormField,
      currentTable,
      config,
      editForm,
      viewedData,
    } = this.props;
    let button;
    let inputs;
    console.log(editForm);

    inputs = config.ordering[currentTable].map((key) => {
      return (
        <div key={key.key} className="view__detailContainer">
          <div className="view__detailTitle">{key.name}</div>
          <input
            disabled={!isEditing}
            name={key.key}
            type="text"
            value={editForm[key.key] == null ? '' : editForm[key.key]}
            onChange={(e) => setEditFormField(e.target.name, e.target.value)}
          />
        </div>
      );
    });

    if (!isEditing) {
      button = (
        <Button
          isTransparent
          message="Edit"
          type="right"
          onClick={this.handleEditToggle}
        >
          <FontAwesomeIcon icon="edit" />
        </Button>
      );
    } else {
      button = (
        <div className="flex--horizontal">
          <Button
            isTransparent
            message="Submit"
            type="rigth"
            onClick={(e) => this.handleSubmitClick(e)}
          >
            <FontAwesomeIcon icon="share-square" />
          </Button>
          <Button
            isTransparent
            message="Cancel"
            type="right"
            onClick={this.handleCancelClick}
          >
            <FontAwesomeIcon icon="times" />
          </Button>
        </div>
      );
    }

    return (
      <>
        {showModal && (
          <Modal
            title="Discard your changes?"
            message="The changes in the form have not been submitted yet. Would you like to discard them and return to the Dashboard page, or cancel and return to the form?"
            leftBtnName="Cancel"
            rightBtnName="Discard"
            exitOnClick={() => this.setShowModal(false)}
            leftBtnOnClick={() => this.setShowModal(false)}
            rightBtnOnClick={this.handleDiscardClick}
          />
        )}
        <Navigation />
        <div className="view flex--horizontal">
          <div className="view__left">
            <div className="view__titlebar flex--horizontal">
              <p>Details</p>
              {button}
            </div>
            <form className="view__details">{inputs}</form>
          </div>
          <div className="view__right">
            <div className="view__titlebar flex--horizontal">
              <p>Tables</p>
              <Button
                isTransparent
                message="Return to Dashboard"
                type="right"
                onClick={() => this.handleReturnToDashboard()}
              >
                <FontAwesomeIcon icon="arrow-left" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(View);
