// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React, {useState, useEffect} from "react";
import api from "services/api";

export default function Conversion(props) {
  const { ...rest } = props;

  const [subscriptionData, setSubscriptionData] = useState({
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get(
        "http://localhost:9090/api/auth/subscription/status"
      );
      const { active, inactive } = response.data.SubscriptionStatus;
      setSubscriptionData({ active, inactive });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  // Dynamically update pie chart data based on subscription status
  const pieChartData = [subscriptionData.active, subscriptionData.inactive];
  
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Your Pie Chart
        </Text>
        <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select>
      </Flex>

      <PieChart
        h='100%'
        w='100%'
        chartData={[subscriptionData.active, subscriptionData.inactive]}
        chartOptions={pieChartOptions}
      />
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
        <Flex direction='column' py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Active
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {subscriptionData.active}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#6AD2FF' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              inactive
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {subscriptionData.inactive}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
