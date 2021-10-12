import { Ticket } from '../ticket';

it('implements good concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'hothorse',
    price: 69,
    userId: '69696969',
  });

  await ticket.save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket?.set({ price: 68 });
  secondTicket?.set({ price: 67 });

  await firstTicket?.save();

  try {
    await secondTicket?.save();
  } catch (err) {
    return done();
  }

  throw new Error("Shouldn't make it here");
});

it('should increment the version number by 1', async () => {
  const ticket = Ticket.build({
    title: 'hothorse',
    price: 69,
    userId: '69696969',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  const modifiedTicket = await Ticket.findById(ticket.id);
  modifiedTicket?.set({ price: 68 });
  await modifiedTicket?.save();
  expect(modifiedTicket?.version).toEqual(1);
  await modifiedTicket?.save();
  expect(modifiedTicket?.version).toEqual(2);
});
