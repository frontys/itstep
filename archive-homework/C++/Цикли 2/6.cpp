#include <iostream>
using namespace std;

int main() {
    int A;
    cout << "Enter number >>> ";
    cin >> A;
    for (int i = 1; i <= A; i++) {
        if (A % i == 0) {
            cout << i << " ";
        }
    }
    cout << endl;
}