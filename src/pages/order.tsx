import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order, Beverage } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Badge, Card, Group, Text, Stack } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus, IconShoppingCart, IconCalendarEvent } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import coffeeImage from "../assets/images/coffee-1.jpg";

interface OrderWithBeverage extends Order {
  beverage?: Beverage;
}

export default function OrdersPage() {
  const { data: orders, error } = useSWR<OrderWithBeverage[]>("/orders");
  const { data: beverages } = useSWR<Beverage[]>("/beverages");

  const ordersWithBeverages = orders?.map(order => ({
    ...order,
    beverage: beverages?.find(beverage => beverage.id === order.beverageId)
  }));

  const totalOrders = orders?.length || 0;
  const totalQuantity = orders?.reduce((sum, order) => sum + order.quantity, 0) || 0;

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">คำสั่งซื้อ</h1>
          <h2>รายการคำสั่งซื้อทั้งหมด {totalOrders} คำสั่ง</h2>
          <p className="text-lg">จำนวนสินค้าทั้งหมด {totalQuantity} รายการ</p>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">รายการคำสั่งซื้อ</h1>

            <Button
              component={Link}
              leftSection={<IconPlus />}
              to="/menu"
              size="sm"
              variant="filled"
              className="flex items-center space-x-2"
            >
              สั่งซื้อใหม่
            </Button>
          </div>

          {!orders && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {orders && orders.length === 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder className="text-center">
              <Group justify="center" mb="md">
                <IconShoppingCart size={48} color="gray" />
              </Group>
              <Text size="lg" fw={500} mb="sm">
                ยังไม่มีคำสั่งซื้อ
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                เริ่มสั่งซื้อเครื่องดื่มแรกของคุณกันเลย
              </Text>
              <Button component={Link} to="/menu" variant="light">
                ดูเมนูเครื่องดื่ม
              </Button>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersWithBeverages?.map((order) => (
              <Card shadow="sm" padding="lg" radius="md" withBorder key={order.id}>
                <Card.Section>
                  <img
                    src={order.beverage?.imageUrl || coffeeImage}
                    alt={order.beverage?.name || "เครื่องดื่ม"}
                    className="w-full h-48 object-cover"
                  />
                </Card.Section>

                <Stack gap="sm" mt="md">
                  <Group justify="space-between">
                    <Text fw={500} size="lg" lineClamp={1}>
                      {order.beverage?.name || `เครื่องดื่ม ID: ${order.beverageId}`}
                    </Text>
                    <Badge color="blue" variant="light">
                      คำสั่งซื้อ #{order.id}
                    </Badge>
                  </Group>

                  {order.beverage?.description && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {order.beverage.description}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        จำนวน:
                      </Text>
                      <Badge color="green" variant="filled">
                        {order.quantity} รายการ
                      </Badge>
                    </Group>

                    {order.beverage?.price && (
                      <Text size="sm" fw={600} c="teal">
                        ฿{(order.beverage.price * order.quantity).toFixed(2)}
                      </Text>
                    )}
                  </Group>

                  <Group>
                    <Text size="sm" fw={500}>
                      หมายเหตุ:
                    </Text>
                    <Text size="sm" c="dimmed">
                      {order.note || "ไม่มีหมายเหตุ"}
                    </Text>
                  </Group>

                  <Group gap="xs" align="center">
                    <IconCalendarEvent size={16} color="gray" />
                    <Text size="xs" c="dimmed">
                      {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </Group>

                  <Group justify="space-between" mt="md">
                    <Button
                      variant="light"
                      size="sm"
                      component={Link}
                      to={`/menu/order/${order.beverageId}`}
                    >
                      สั่งซื้อซ้ำ
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
          </div>

          {ordersWithBeverages && ordersWithBeverages.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl" className="bg-gray-50">
              <Group justify="space-between">
                <div>
                  <Text size="lg" fw={600}>
                    สรุปคำสั่งซื้อ
                  </Text>
                  <Text size="sm" c="dimmed">
                    ข้อมูลทั้งหมดในระบบ
                  </Text>
                </div>
                <Stack gap="xs" align="end">
                  <Text size="sm">
                    จำนวนคำสั่งซื้อ: <span className="font-semibold">{totalOrders}</span>
                  </Text>
                  <Text size="sm">
                    จำนวนสินค้าทั้งหมด: <span className="font-semibold">{totalQuantity}</span>
                  </Text>
                  {ordersWithBeverages && (
                    <Text size="sm">
                      มูลค่ารวม: <span className="font-semibold text-teal-600">
                        ฿{ordersWithBeverages
                          .reduce((sum, order) => {
                            return sum + (order.beverage?.price || 0) * order.quantity;
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </Text>
                  )}
                </Stack>
              </Group>
            </Card>
          )}
        </section>
      </Layout>
    </>
  );
}
