import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Image } from 'react-native';
import { Container, Content, Text, Left, Right, View, Card, } from 'native-base';
import { Col, Row, } from 'react-native-easy-grid';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';


class DocumentList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
     
    }

  }

  render() {
    let data = [{ name: 'document1.pdf' }, { name: 'document2.pdf' }, { name: 'document3.pdf' }, { name: 'document1.pdf' }]
    const { showCard, show, } = this.state

    return (
      <Container>
        <Content>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              <View>
                <Card style={styles.cardStyles}>
                  <Row>
                    <Col style={{ width: '15%' }}>
                      <Image source={require('../../../../assets/images/pdf.png')} style={{ width: 25, height: 25 }} />
                    </Col>
                    <Col style={{ width: '75%' }}>
                      <Text style={styles.innerCardText}>{item.name}</Text>
                    </Col>
                    <Col style={{ width: '10%' }}>
                      <TouchableOpacity style={{ alignItems: 'center',marginTop:5 }}>
                        <EvilIcons name="trash" style={{ fontSize: 20, color: 'red' }} />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Card>
              </View>
            } />
        </Content>
      </Container>
    )
  }
}

export default DocumentList

const styles = StyleSheet.create({
  cardStyles: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
    padding: 10
  },
  innerCardText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: '#4765FF'
  },
})
