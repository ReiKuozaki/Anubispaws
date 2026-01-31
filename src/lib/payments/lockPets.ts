export async function lockPetsFromOrder(order: any, prisma: any) {
  if (!order.order_pets?.length) return;

  const petIds = order.order_pets.map((pet: any) => pet.id);

  await prisma.pets.updateMany({
    where: {
      id: { in: petIds },
      status: "available",
    },
    data: {
      status: "pending",
    },
  });
}
