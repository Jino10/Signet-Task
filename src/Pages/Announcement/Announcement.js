import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './Announcement.css';
import { makeRequest, fetchCall } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../Widgets/Loading';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

export default function Announcement() {
  const [optionval, setOptionval] = useState('all');
  const [search, setSearch] = useState('All');
  const [message, setMessage] = useState();
  const [msg, setMsg] = useState();
  const [searcherr, setSearcherr] = useState();
  const [msgError, setMsgError] = useState();
  const [msgError1, setMsgError1] = useState();
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [variant, setVarient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { buttonTracker } = useAnalyticsEventTracker();

  const handleClose = () => {
    setShow(false);
    window.location = '/announcement';
  };

  const fetchOrgName = async (searchtext) => {
    const response = await makeRequest(`${APIUrlConstants.GET_ORG_NAME}?orgName=${searchtext}`);
    const statusCode = response[0];
    const responseData = response[1];
    if (httpStatusCode.SUCCESS === statusCode) {
      setPosts(responseData.data);
    }
    return responseData.data;
  };

  const postNotification = async () => {
    const response = await fetchCall(APIUrlConstants.POST_NOTIFICATION_API, apiMethods.POST, {
      alertMessage: optionval === 'all' ? msg : message,
      orgName: optionval === 'all' ? 'All' : search,
    });
    const statusCode = response[0];
    const responseData = response[1];
    setIsLoading(true);
    buttonTracker(gaEvents.SEND_ANNOUNCEMENT);
    if (httpStatusCode.SUCCESS === statusCode) {
      setTimeout(() => {
        setIsLoading(false);
        setShow(true);
      }, 2000);
      setVarient('success');
      setPost(responseData.message);
      setMsg('');
      setMessage('');
      setSearch('');
      setTimeout(() => {
        setShow(false);
        window.location = '/announcement';
      }, 5000);
    } else {
      setVarient('danger');
      setShow(true);
      setPost(responseData.message);
      setMsg('');
      setMessage('');
      setSearch('');
      setTimeout(() => {
        setShow(false);
        window.location = '/announcement';
      }, 5000);
    }
  };

  const onEditorStateChange1 = (text) => {
    setEditorState(text);
  };

  const onEditorStateChange = (text) => {
    setEditorState(text);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setSearchTitle(event.target.value);
    fetchOrgName(event.target.value);
  };

  const onSearch = async (searchTerm) => {
    setSearch(searchTerm);
    if (search === searchTerm) {
      setPosts([]);
    }
    if (searchTerm) {
      setSearcherr('');
    }
  };

  const specificChange = () => {
    setSearch('');
  };

  const validate = async () => {
    setSearcherr('');
    setMsgError('');
    setMsgError1('');
    const editorStateRaw = convertToRaw(editorState.getCurrentContent()).blocks[0].text;
    if (optionval === 'all') {
      if (!msg || !editorStateRaw) {
        setMsgError1('Enter valid Message');
        setShow(false);
      } else {
        setMsgError1('');
        postNotification();
      }
    }
    if (optionval === 'specific') {
      const orgname = await fetchOrgName(search);
      setPosts([]);
      if (!search && !message) {
        setSearcherr('Enter valid Organization');
        setMsgError('Enter valid Message');
        setShow(false);
      } else if (orgname === '') {
        setSearcherr('Enter valid Organization');
        if (!message) {
          setMsgError('Enter valid Message');
        }
        setShow(false);
      } else if (orgname !== '' && !message) {
        setMsgError('Enter valid Message');
        setShow(false);
      } else if (!search && message) {
        setSearcherr('Enter valid Organization');
      } else if (!editorStateRaw) {
        setMsgError('Enter valid Message');
        setShow(false);
      } else {
        postNotification();
      }
    }
  };

  useEffect(() => {
    setEditorState(EditorState.createEmpty());
  }, [search]);

  return (
    <Form>
      <div className="wrapperBase">
        <div className="wrapperCard">
          <div className="wrapperCard--header">
            <div className="titleHeader">
              <div className="info">
                <h6>Announcements</h6>
              </div>
            </div>
          </div>
          <div className="wrapperCard--body">
            <div className="formWrap announcentBox">
              <Form.Group className="announcemnetSelect input_group_dropdown mb-2 second-form">
                <Form.Select
                  as="select"
                  value={optionval}
                  onChange={(e) => {
                    setOptionval(e.target.value);
                    setEditorState(EditorState.createEmpty());
                  }}
                  onClick={specificChange}
                >
                  <option value="all">All Organizations</option>
                  <option value="specific">Specific Organization</option>
                </Form.Select>
              </Form.Group>
              {optionval === 'specific' ? (
                <div>
                  <div className="relative">
                    <Form.Group className="first-form">
                      <Form.Control
                        className={`search searchOrg ${searcherr ? 'error' : null}`}
                        type="text"
                        placeholder="Search Organization"
                        value={search}
                        autoFocus
                        onChange={handleSearch}
                      />
                      <img
                        className="label"
                        src={process.env.REACT_APP_PUBLIC_URL + 'images/users/search.svg'}
                        alt=""
                        aria-hidden="true"
                      />
                      <div className="dataResult">
                        {posts.map((item) => {
                          if (search === '') {
                            return null;
                          }
                          if (searchTitle !== search) {
                            return null;
                          }
                          return (
                            <div
                              className="dataItem"
                              target="_blank"
                              onClick={() => onSearch(item)}
                              aria-hidden="true"
                              key={item}
                            >
                              <p>{item}</p>
                            </div>
                          );
                        })}
                      </div>
                      {searcherr !== ' ' ? <h1 className="msgError">{searcherr}</h1> : null}
                      <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName={`wrapperClassName ${msgError ? 'error' : null}`}
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange1}
                        onContentStateChange={(data) => {
                          setMessage(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                          setMsg(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                          data && setMsgError('');
                          data && setMsgError1('');
                        }}
                        toolbar={{
                          options: ['inline', 'link'],
                          inline: {
                            options: ['bold', 'italic', 'underline'],
                          },
                        }}
                      />
                    </Form.Group>
                  </div>
                  {msgError !== ' ' ? <h1 className="msgError">{msgError}</h1> : null}
                </div>
              ) : null}

              {optionval === 'all' ? (
                <div>
                  <Form.Group>
                    <Editor
                      editorState={editorState}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName={`wrapperClassName ${msgError1 ? 'error' : null}`}
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorStateChange}
                      onContentStateChange={(data) => {
                        setMessage(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                        setMsg(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                        data && setMsgError('');
                        data && setMsgError1('');
                      }}
                      toolbar={{
                        options: ['inline', 'link'],
                        inline: {
                          options: ['bold', 'italic', 'underline'],
                        },
                      }}
                    />
                  </Form.Group>
                  {msgError1 !== ' ' ? <h6 className="msgError">{msgError1}</h6> : null}
                </div>
              ) : null}
              <Button className="buttonPrimary mb-5 mt-4" onClick={validate}>
                {' '}
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/tickets/send.svg'} alt="" className="me-2" />
                Send
              </Button>
              {isLoading ? <Loading /> : null}
              <Alert variant={variant} show={show} dismissible className="alertWrapper" onClick={handleClose}>
                <p>{post}</p>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
