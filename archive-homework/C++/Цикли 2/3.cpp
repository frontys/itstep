#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number >>> ";
    cin >> n;

    int m = n;
    int res = 0;
    int k = 1;
    if (m < 0) m = -m;

    while (m > 0) {
        int d = m % 10;
        if (d != 3 && d != 6) {
            res += d * k;
            k *= 10;
        }
        m /= 10;
    }

    if (n < 0 && res != 0) res = -res;
    cout << "Result >>> " << res << endl;
    return 0;
}