#include <iostream>
using namespace std;

int main() {
    int A1, A2;
    cout << "Enter two numbers >>> ";
    cin >> A1 >> A2;
    int minV;
    if (A1 < A2) {
        minV = A1;
    } else {
        minV = A2;
    }
    for (int i = 1; i <= minV; i++) {
        if (A1 % i == 0 && A2 % i == 0) {
            cout << i << " ";
        }
    }
    cout << endl;

    return 0;
}
