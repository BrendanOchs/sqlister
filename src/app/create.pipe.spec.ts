import { CreatePipe } from './create.pipe';

describe('CreatePipe', () => {
  it('create an instance', () => {
    const pipe = new CreatePipe();
    expect(pipe).toBeTruthy();
  });
});
