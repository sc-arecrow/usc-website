import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { carouselOne, carouselTwo, carouselThree } from '../../resources/images';
import {
  UncontrolledCarousel,
  Container,
  Row,
  Col,
  Jumbotron,
  Button
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import EventCard from '../Events/EventCard'
import { getUpcomingEvents } from '../../utils/actions'
import { formatEvents } from '../../utils/utils'
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom'

const items = [
  {
    src: carouselOne,
    altText: 'Renaissance',
    caption: 'USC FOP 2018 O\'Camp Finale Night',
    header: 'Renaissance'
  },
  {
    src: carouselTwo,
    altText: 'Welcome',
    caption: 'The 17th USC Committee',
    header: 'Welcome'
  },
  {
    src: carouselThree,
    altText: 'End of an Era',
    caption: 'AY17/18 Closes',
    header: 'End of Year Dinner'
  }
];

class Home extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { firestore } = this.context.store
    getUpcomingEvents(firestore, 10)
  }

  render() {
    var { upcomingEvents, spaces, eventTypes, firebase, history } = this.props

    return (
      <Container className="mb-5">
        <Row>
          <Col sm="12">
            <UncontrolledCarousel items={items} />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Jumbotron className="pb-0 mb-0 h-100">
              <h1 style={{fontWeight: 300}}>About Us</h1>
              <p className="lead">The University Scholars Club (USC) is a community of students enrolled in the National University of Singapore (NUS) University Scholars Programme (USP), which is a multidisciplinary, partially residential academic programme for NUS undergraduates.</p>
              <p className="lead">
                <Button color="primary" onClick={() => history.push('/about')}>Learn More</Button>
              </p>
              <hr className="my-2" />
              <br />
                <h1 style={{fontWeight: 300}}>Upcoming Events</h1>
              <Container>
                <Row>
                  {
                    isLoaded(upcomingEvents) && isLoaded(eventTypes) ? upcomingEvents.length > 0 ? upcomingEvents.map((event)=>
                      <Col key={event.id} xs="12" md="6" className="mb-2">
                        <EventCard
                          event={event}
                          eventTypes={eventTypes}
                          spaces={spaces}
                          buttonText='See More'
                          firebase={firebase}
                          hasModal={true} />
                      </Col>
                    ) : <Col><h4>No Upcoming Events :( Stay tuned!</h4></Col> : <Col><h4><FontAwesomeIcon icon="spinner" spin /> Loading Events...</h4></Col>
                  }
                </Row>
              </Container>
              <br/>
              <p className="lead">
                <Button color="primary" onClick={() => history.push('/events')}>View All Events</Button>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    upcomingEvents: formatEvents(state.firestore, 'upcomingEvents', true),
    eventTypes: state.firestore.data.eventTypes,
    spaces: state.firestore.data.spaces,
  }
}

export default withRouter(compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(Home))