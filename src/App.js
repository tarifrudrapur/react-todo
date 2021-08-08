import React from 'react';
import { Tabs, Layout, Card } from 'antd';
import Todos from './components/todos';
import Users from './components/users';


const { TabPane } = Tabs;
const { Content } = Layout;

function App() {

  const style = {
    margin: 'auto',
    width: '50%',
    padding: 10
  }


  return (
    <div style={style}>
      <Layout>
        <Content>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Todos" key="1">
                <Todos />
              </TabPane>
              <TabPane tab="Users" key="2">
                <Users />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
