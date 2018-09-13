const N_UPPER_BOUND = 25551;
const K_UPPER_BOUND = 6;

const isKPrimeSum = (() => {
  let _memoize: any;
  let KPrimeSumAtIndex = {
    yes: true,
    no: false
  };

  initializePrimeEratosthenesInsideMemoizeObject();

  return (n: number, k: number): any => {
    if (n < 2 || n > N_UPPER_BOUND || k < 1 || k > K_UPPER_BOUND) {
      return undefined;
    }

    if (k === 1 || _memoize[k][n] !== undefined) {
      //> Known cases. k == 1 is covered in _memoize initialization.
      return _memoize[k][n];
    }

    //> Dynamically build up _memoize object.

    for (let i = 2; i < N_UPPER_BOUND; i++) {
      if (isPrime(i) && isKPrimeSum(n - i, k - 1) === KPrimeSumAtIndex.yes) {
        return (_memoize[k][n] = KPrimeSumAtIndex.yes);
      }
    }

    return (_memoize[k][n] = KPrimeSumAtIndex.no);

    function isPrime(number: number) {
      return _memoize[1][number] === KPrimeSumAtIndex.yes;
    }
  };

  function initializePrimeEratosthenesInsideMemoizeObject() {
    _memoize = Array.apply(null, Array(K_UPPER_BOUND)).map(() =>
      Array(N_UPPER_BOUND)
    );
    let _primeEratosthenes = _memoize[1];
    _primeEratosthenes[0] = _primeEratosthenes[1] = false;
    let limit = Math.round(Math.sqrt(N_UPPER_BOUND));

    for (let i = 2; i < N_UPPER_BOUND; i++) {
      if (_primeEratosthenes[i] !== KPrimeSumAtIndex.no) {
        //> Because `i` has NOT been marked as a composite number, it does not exist a number other than 1 that
        //> is a devisor of `i`. We checked all the numbers that less than `i` which are all possible cases.
        //> Then `i` is a prime number by definition.
        //> Since `i` is a prime number, `i` is a 1-sum primes.
        //> Then _memoize[1][i] = KPrimeSumAtIndex.yes;
        _primeEratosthenes[i] = KPrimeSumAtIndex.yes;
        for (let composite = i * i; composite < limit; composite += i) {
          //> Since `composite` is an composite number which is divisible by i, `composite` is NOT a 1-sum primes.
          //> _memoize[1][composite] = KPrimeSumAtIndex.no;
          _primeEratosthenes[composite] = KPrimeSumAtIndex.no;
        }
      }
    }
  }
})();

/* SPECS
*/
describe("isKPrimeSum", () => {
  let primes: any;
  const getRandomInt = (min: any, max: any) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  beforeAll(() => {
    // Build primes number list.
    let erato = Array(N_UPPER_BOUND);
    erato[0] = erato[1] = false;

    for (let i = 2; i < N_UPPER_BOUND; i++) {
      if (erato[i] !== false) {
        erato[i] = true;
        for (let opp = i * i; opp < N_UPPER_BOUND; opp += i) {
          erato[opp] = false;
        }
      }
    }

    primes = erato.map((v, i) => (v ? i : v)).filter(Boolean);
  });

  test("a prime is a sum of one prime number by the prime itself", () => {
    primes.forEach((prime: any) => {
      let message = `Expect isKPrimeSum(${prime}, 1) to returns true because ${prime} is a prime!`;
      expect(isKPrimeSum(prime, 1), message).toBe(true);
    });
  });

  test("Sum of 2 primes is 2-prime sum", () => {
    let smallPrimes = primes.slice(0, 100);
    smallPrimes.forEach((prime1: any) => {
      smallPrimes.forEach((prime2: any) => {
        if (prime1 + prime2 < N_UPPER_BOUND) {
          let message = `Expect isKPrimeSum(${prime1 +
            prime2}, 2) to returns true because ${prime1 +
            prime2} = ${prime1} + ${prime2}`;
          // console.log(message);
          expect(isKPrimeSum(prime1 + prime2, 2), message).toBe(true);
        }
      });
    });
  });

  test("5000 randomization test cases from 1 to 5 primes sum", () => {
    for (let testIndex = 0; testIndex < 5000; testIndex++) {
      let numberOfPrimes = getRandomInt(1, 5);
      let primeElements = [];
      for (let i = 0; i < numberOfPrimes; i++) {
        let index = getRandomInt(0, primes.length - 1);
        primeElements.push(primes[index]);
      }

      let sum = primeElements.reduce((a, b) => a + b, 0);
      if (sum < N_UPPER_BOUND) {
        let message = `Expect isKPrimeSum(${sum}, ${numberOfPrimes}) to returns true because ${sum} = ${primeElements.join(
          " + "
        )}`;
        // console.log(message)
        expect(isKPrimeSum(sum, numberOfPrimes), message).toBe(true);
      }
    }
  });
});
