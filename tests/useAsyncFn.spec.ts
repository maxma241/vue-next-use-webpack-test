import useAsyncFn, { AsyncState } from '../src/useAsyncFn';

type AdderFn = (a?: number, b?: number) => Promise<number>;

describe('useAsyncFn', () => {
  let composition: [AsyncState<number>, AdderFn];
  it('should be defined', () => {
    expect(useAsyncFn).toBeDefined();
  });
  const adder: AdderFn = async (a?: number, b?: number): Promise<number> => {
    return (a || 0) + (b || 0);
  };

  beforeEach(() => {
    composition = useAsyncFn(adder, () => { }) as [AsyncState<number>, AdderFn]
    
  })

  it('awaits the result', async () => {
    expect.assertions(3);

    const [state, callback] = composition;
    let result: number;

    result = await callback(123, 111);

    expect(result).toEqual(234);

    expect(state.value).toEqual(234);
    expect(result).toEqual(state.value);
  });

})

describe('args can be passed to the function', () => {
  let composition: [AsyncState<number>, AdderFn];
  let callCount = 0;
  const adder = async (a?: number, b?: number): Promise<number> => {
    callCount++;
    return (a || 0) + (b || 0);
  };

  beforeEach(() => {
    composition = useAsyncFn(adder, () => {})
  });

  it('initially does not have a value', () => {
    const [state] = composition;

    expect(state.value).toEqual(undefined);
    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(undefined);
    expect(callCount).toEqual(0);
  });

  describe('when invoked', () => {
    it('resolves a value derived from args', async () => {
      expect.assertions(4);

      const [state, callback] = composition;

      await callback(8, 7);

      expect(callCount).toEqual(1);
      expect(state.loading).toEqual(false);
      expect(state.error).toEqual(undefined);
      expect(state.value).toEqual(15);
    });
  });
})